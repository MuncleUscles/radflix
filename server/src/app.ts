import express from 'express';
import models, { connectDb } from './models';
import uuidv4 from 'uuid';
import {RadixSerializer, RadixAtom, RadixMessageParticle, RadixAccount, RadixKeyStore, RadixIdentityManager, RadixIdentity, RadixTransactionBuilder, RRI, radixUniverse, RadixUniverse} from 'radixdlt'
import fs from 'fs-extra'
import BN from 'bn.js'
import cors from 'cors'
import bodyParser from 'body-parser'

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3001;
app.use(cors())
app.use(bodyParser.json())

let identity: RadixIdentity

radixUniverse.bootstrap(RadixUniverse.LOCALHOST_SINGLENODE)

connectDb()
.then(() => {
  return loadIdentity()
}).then(_identity => {
  identity = _identity
  subscribeForPurchases()

  app.listen(port, (err: Error) => {
    if (err) {
      console.error(err);
    } else {
      console.log('NODE_ENV =', process.env.NODE_ENV);
    }
  });
})


// Store and recover account
const identityManager = new RadixIdentityManager()
const keystorePath = 'keystore.json'
const keystorePassword = `don't tell anyone :P`
async function loadIdentity() {
  if (fs.existsSync(keystorePath)) {
    // Load account
    const contents = await fs.readJSON(keystorePath)  
    const address = await RadixKeyStore.decryptKey(contents, keystorePassword)

    const identity = identityManager.addSimpleIdentity(address)
    await identity.account.openNodeConnection()

    console.log('Loaded identity')

    return identity
  } else {
    const identity = identityManager.generateSimpleIdentity()
    await identity.account.openNodeConnection()
    const contents = await RadixKeyStore.encryptKey(identity.address, keystorePassword)
    await fs.writeJSON(keystorePath, contents)

    console.log('Generated new identity')

    return identity
  }
}




const accounts: {[address: string]: RadixAccount} = {}
const getAccount = async function(address: string) {
  let account: RadixAccount
  if (address in accounts) {
    account = accounts[address]
  } else {
    account = RadixAccount.fromAddress(address)
    accounts[address] = account
    await account.openNodeConnection()
  }

  console.log('got account')

  // Wait for the account to be synced
  await account.isSynced()
    .filter(val => {
      console.log('synced', val)
      return val
    })
    .take(1)
    .toPromise()

  return account
}





app.get('/', (req, res) => res.send(`Hi`))


// Routes
// Access Reqeust
app.get('/movies', async (req, res) => {
  models.Movie.find({}, '-contentUrl', (err, movies) => {
    if (err) {
      res.status(400).send(err)
      return
    }

    res.send(movies)
  })
})


// Access Reqeust
  app.get('/request-access', async (req, res) => {
    const id = uuidv4()
    const request = new models.AccessRequest({
      id,
      consumed: false,
    })

    await request.save()

    res.send(id)
  })

// Access a resource (signed(address, challenge), tokenId)
  app.post('/movie', async (req, res) => {
    console.log('Requesting access to movie')
    const serializedAtom = req.body.atom
    const movieTokenUri = req.body.movieTokenUri

    const atom = RadixSerializer.fromJSON(serializedAtom) as RadixAtom
    const particle = atom.getFirstParticleOfType(RadixMessageParticle)
    const from = particle.from
    const data = particle.getData().asJSON()

    // Check signature
    if (!from.verify(atom.getHash(), atom.signatures[from.getUID().toString()])) {
      res.status(400).send('Signature verification failed')
      throw new Error('Signature verification failed')
    }

    console.log('Signature ok')

    const query = {
      id: data.challenge
    }

    // Check challenge
    const document = await models.AccessRequest.findOne(query).exec()
    if (!document || document.get('consumed')) {
      res.status(400).send('Invalid challenge')
      throw new Error('Invalid challenge')
    }

    console.log('challenge ok')

    document.set('consumed', true)
    await document.save()


    // Check ownership
    const account = await getAccount(from.toString())
    console.log('got synced account')
    const balance = account.transferSystem.balance
    console.log(balance)

    // If don't have any movie tokens
    if(!(movieTokenUri in balance) || balance[movieTokenUri].ltn(1)) {
      res.status(400).send(`Don't own the movie`)
      throw new Error(`Don't own the movie`)
    }

    console.log('movie owned')

    const movie = await models.Movie.findOne({
      tokenUri: movieTokenUri
    }).exec()

    if(!movie) {
      res.status(400).send(`Movie doesn't exist`)
      throw new Error(`Movie doesn't exist`)
    }

    res.send(movie)
  })




// Admin
  // Add a movie
  app.post('/admin/movie', async (req, res) => {
    // Create token
    const name = req.param('name')
    const symbol = req.param('symbol')
    const description = req.param('description')
    const posterUrl = req.param('posterUrl')
    const contentUrl = req.param('contentUrl')
    const price = req.param('price') ? parseFloat(req.param('price')) : 1

    const uri = new RRI(identity.address, symbol)

    try {
      new RadixTransactionBuilder().createTokenMultiIssuance(
        identity.account,
        name,
        symbol,
        description,
        1,
        1,
        posterUrl,
      ).signAndSubmit(identity)
      .subscribe({
        next: status => {
          console.log(status)
        },
        complete:  async () => {
          // Create DB entry
          const movie = new models.Movie({
            tokenUri: uri.toString(),
            name,
            description,
            price,
            posterUrl,
            contentUrl,
          })

          await movie.save()

          res.send(uri)
        }, error: (e) => {
          console.log(e)
          res.status(400).send(e)
        }
      })
    } catch(e) {
      res.status(400).send(e.message)
    }
  })


// Buying a movie
function subscribeForPurchases() {
  identity.account.transferSystem.getAllTransactions().subscribe(async (txUpdate) => {
    if (!txUpdate.transaction) {
      return
    }

    if (!(radixUniverse.nativeToken.toString() in txUpdate.transaction.balance)) {
      return
    }

    models.Purchase.findOne({aid: txUpdate.aid.toString()}, async (err, res) => {
      if(res) {
        //Already processed
        return
      }
      if (!txUpdate.transaction) {
        return
      }

      const tokenUri = txUpdate.transaction.message
      const purchaser = Object.values(txUpdate.transaction.participants)[0]
      const movie = await models.Movie.findOne({
        tokenUri
      }).exec()

      if (!movie) {
        throw new Error(`Movie doesn't exist`)
        // TODO: retrun money
      }

      const moneySent = txUpdate.transaction.tokenUnitsBalance[radixUniverse.nativeToken.toString()]
      if (moneySent.lessThan(movie.get('price'))) {
        throw new Error('Insufficent patment')
        // TODO: return money
      }

      // Mint a new movie token
      RadixTransactionBuilder.createMintAtom(identity.account, tokenUri, 1)
        .signAndSubmit(identity)
        .subscribe({complete: () => {
          // Send the movie token
          RadixTransactionBuilder.createTransferAtom(identity.account, purchaser, tokenUri, 1)
            .signAndSubmit(identity)
            .subscribe({
              complete: () => {
                console.log('Movie was purchased')
                new models.Purchase({
                  aid: txUpdate.aid
                }).save()
              }
            })
        }})
    })
  })
}


  // Add a movie
  app.post('/admin/buy-movie', (req, res) => {
    // Create token
    const tokenUri = req.body.tokenUri
    const address = req.body.address

    const purchaser = RadixAccount.fromAddress(address)

    // Mint a new movie token
    RadixTransactionBuilder.createMintAtom(identity.account, tokenUri, 1)
    .signAndSubmit(identity)
    .subscribe({complete: () => {
      // Send the movie token
      RadixTransactionBuilder.createTransferAtom(identity.account, purchaser, tokenUri, 1)
        .signAndSubmit(identity)
        .subscribe({
          complete: () => {
            console.log('Movie was purchased')
            res.send('Done')
          }
        })
    }})
  })
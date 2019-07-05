import express from 'express';
import { connectDb } from './models';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3001;


// Store and recover account



connectDb().then(() => {
  app.listen(port, (err: Error) => {
    if (err) {
      console.error(err);
    } else {
      console.log('NODE_ENV =', process.env.NODE_ENV);
    }
  });
})


app.get('/', (req, res) => res.send(`Hi`))


// Routes

// Access Reqeust
  // Create challenge seed
  // store in DB - need a db
  // send to user

// Access a resource (signed(address, challenge), tokenId)
  // Verify signature
  // Verify ownership
  // Return resource

// Strech goal - Buy
  // When get XRD with reference
  // Send a movie token

// Admin
  // add movie(symbol, data)
    // create token
    // store in db
  // add movie viewer(address)
    // mint new token
    // send to user

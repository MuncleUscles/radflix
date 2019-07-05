import express from 'express';
import { connectDb } from './models';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3001;


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

// Auth
  // Create challenge seed
  // store in DB - need a db
  // send to user

// Auth confirm - maybe on ledger
  // Receive signed challenge + address
  // Load account

// List movies(challenge)

// Stream movie(challenge, movie id)

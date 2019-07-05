import express from 'express';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3001;

app.listen(port, (err: Error) => {
  if (err) {
    console.error(err);
  } else {
    console.log('NODE_ENV =', process.env.NODE_ENV);
  }
});

app.get('/', (req, res) => res.send(`Hi`))

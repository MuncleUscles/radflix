import express from 'express';

const app: express.Application = express();

app.listen(process.env.PORT || 3000, (err: Error) => {
  if (err) {
    console.error(err);
  }
});

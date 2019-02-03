import 'babel-polyfill';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes';

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use('/api/v1/', router);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Politico' });
});

app.all('*', (req, res) => {
  res.status(404).json({ message: 'This endpoint does not exist' });
});

app.listen(port);

export default app;

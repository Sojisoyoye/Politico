import 'babel-polyfill';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { urlencoded, json } from 'body-parser';
import router from './routes';

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const swaggerDocument = YAML.load(path.join(process.cwd(), 'server/docs/doc.yaml'));

app.use(json());
app.use(urlencoded({ extended: false }));


app.use(cors());

app.use('/api/v1/', router);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to Politico' });
});


app.all('*', (req, res) => {
  res.status(404).json({ message: 'This endpoint does not exist' });
});

app.listen(port);

export default app;

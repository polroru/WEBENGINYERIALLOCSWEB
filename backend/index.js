
import express from 'express';

import { articlesRouter } from './routes/articles.routes.js';

import { usersRouter } from './routes/users.routes.js'

import { reportsRouter } from './routes/reports.routes.js'

import bodyParser from 'body-parser';

import cors from 'cors';

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello world');
});

app.use('/articles', articlesRouter);

app.use('/user', usersRouter);

app.use('/report', reportsRouter);

app.use((req, res) => {
  res.send('Page not found')
}) //per quan no es troba la ruta


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






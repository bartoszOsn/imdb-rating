import express from 'express';
import { searchRoute } from './searchRoute';
import { ratingsRoute } from './ratingsRoute';

const app = express();
const port = 3000;

app.use(searchRoute);
app.use(ratingsRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

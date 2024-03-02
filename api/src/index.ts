import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import { searchRoute } from './searchRoute';
import { ratingsRoute } from './ratingsRoute';

const app = express();
const port =  process.env.PORT ? parseInt(process.env.PORT) : 3000;
const url = process.env.CLIENT_URL ? '0.0.0.0' : 'localhost';

if (process.env.CLIENT_URL) {
	app.use((_, res, next) => {
		res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	});
}

app.use(searchRoute);
app.use(ratingsRoute);

app.listen(port, url, () => {
	console.log(`Server is running at ${url}:${port}`);
});

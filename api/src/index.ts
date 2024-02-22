import 'reflect-metadata';
import express from 'express';
import { searchRoute } from './searchRoute';
import { ratingsRoute } from './ratingsRoute';
import { datasource } from './database/datasource';
import { fillDatabaseIfEmpty } from './database/fillDatabaseIfEmpty';

const app = express();
const port = process.env.PORT ?? 3000;

if (process.env.CLIENT_URL) {
	app.use((_, res, next) => {
		res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
	});
}

app.use(searchRoute);
app.use(ratingsRoute);

datasource.initialize()
	.then(() => fillDatabaseIfEmpty())
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is running at http://localhost:${port}`);
		});
	});
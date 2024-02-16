import 'reflect-metadata';
import express from 'express';
import { searchRoute } from './searchRoute';
import { ratingsRoute } from './ratingsRoute';
import { datasource } from './database/datasource';
import { fillDatabaseIfEmpty } from './database/fillDatabaseIfEmpty';

const app = express();
const port = 3000;

app.use(searchRoute);
app.use(ratingsRoute);

datasource.initialize()
	.then(() => fillDatabaseIfEmpty())
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is running at http://localhost:${port}`);
		});
	});
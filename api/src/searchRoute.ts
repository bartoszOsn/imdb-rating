import { Router } from 'express';
import { searchTMDB } from './tmdb/searchTMDB';

const router = Router();

router.get('/search', (req, res) => {
	const { query } = req.query;

	if (!query) {
		res.status(400).send('Missing query parameter');
		return;
	}

	searchTMDB(query as string)
		.then((dto) => {
			res.json(dto);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('An error occurred');
		});
})

export { router as searchRoute };

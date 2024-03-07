import { Router } from 'express';
import { getTrendingTMDB } from './tmdb/getTrendingTMDB';

const router = Router();

router.get('/trending', (_req, res) => {
	getTrendingTMDB()
		.then((trending) => {
			res.json(trending);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('An error occurred');
		});
});

export { router as trendingRoute };
import { Router } from 'express';
import { getRatingsTMDB } from './tmdb/getRatingsTMDB';

const router = Router();

router.get('/ratings', (req, res) => {
	const { imdbId } = req.query;

	if (!imdbId) {
		res.status(400).send('Missing imdbId parameter');
		return;
	}

	getRatingsTMDB(imdbId as string)
		.then((ratings) => {
			res.json(ratings);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('An error occurred');
		});
});

export { router as ratingsRoute };

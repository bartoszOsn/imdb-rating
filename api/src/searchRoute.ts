import { Router } from 'express';
import { SearchShowResultDTO } from '../../shared/SearchShowResultDTO';
import { searchTvShow } from './database/searchTvShow';

const router = Router();

router.get('/search', (req, res) => {
	const { query } = req.query;

	if (!query) {
		res.status(400).send('Missing query parameter');
		return;
	}

	searchTvShow(query as string)
		.then((entities) => {
			const dto: SearchShowResultDTO = {
				shows: entities.map((entity) => ({
					id: entity.id,
					name: entity.title,
				}))
			}
			res.json(dto);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('An error occurred');
		});
})

export { router as searchRoute };

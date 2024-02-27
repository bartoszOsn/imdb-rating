import { Router } from 'express';
import { SearchShowResultDTO, TvShowDTO } from '../../shared/SearchShowResultDTO';
import { searchTvShow } from './database/searchTvShow';
import { combineWith } from './util/promise/combineWith';
import { getRatingsByIds } from './database/getRatingsByIds';
import { TvShowEntity } from './database/entity/TvShowEntity';
import { RatingEntity } from './database/entity/RatingEntity';

const router = Router();

router.get('/search', (req, res) => {
	const { query } = req.query;

	if (!query) {
		res.status(400).send('Missing query parameter');
		return;
	}

	searchTvShow(query as string)
		.then(combineWith<Array<TvShowEntity>, Array<RatingEntity>>((entities) => getRatingsByIds(entities.map((entity) => entity.id))))
		.then(([entities, ratings]) => {
			const ratingMap = new Map<string, RatingEntity>(
				ratings.map((rating) => [rating.id, rating])
			);

			const shows: Array<TvShowDTO> = entities.map((entity) => ({
				id: entity.id,
				name: entity.title,
				startYear: entity.startYear,
				endYear: entity.endYear,
				rating: ratingMap.get(entity.id)?.averageRating ?? 0
			}));

			const dto: SearchShowResultDTO = {
				shows: shows.sort((a, b) => (ratingMap.get(b.id)?.numVotes ?? 0) - (ratingMap.get(a.id)?.numVotes ?? 0))
			}
			res.json(dto);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('An error occurred');
		});
})

export { router as searchRoute };

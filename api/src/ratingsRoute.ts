import { Router } from 'express';
import { RatingsDTO, SeasonDTO } from '../../shared/RatingsDTO';
import { datasource } from './database/datasource';
import { EpisodeEntity } from './database/entity/EpisodeEntity';

const router = Router();

router.get('/ratings', (req, res) => {
	const { imdbId } = req.query;

	if (!imdbId) {
		res.status(400).send('Missing imdbId parameter');
		return;
	}

	getRatings(imdbId as string)
		.then((ratings) => {
			res.json(ratings);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('An error occurred');
		});
});

export { router as ratingsRoute };

async function getRatings(imdbId: string): Promise<RatingsDTO> {
	const episodeEntities = await datasource.getRepository(EpisodeEntity).find({
		where: {
			tvShowId: imdbId
		}
	});

	const seasons = new Map<number, SeasonDTO>();
	for (let episodeEntity of episodeEntities) {
		const seasonNumber = episodeEntity.season;
		const episodeRating = episodeEntity.rating;
		const episodeVotes = episodeEntity.votes;
		const season: SeasonDTO = seasons.get(seasonNumber) ?? { season: seasonNumber, episodes: [] };
		season.episodes.push({ episode: episodeEntity.episode, rating: episodeRating, votes: episodeVotes });
		seasons.set(seasonNumber, season);
	}

	const ratings: RatingsDTO = {
		seasons: Array.from(seasons.values())
			.map(season => ({ ...season, episodes: season.episodes.sort((a, b) => a.episode - b.episode) }))
			.sort((a, b) => a.season - b.season)
	};
	return ratings;
}
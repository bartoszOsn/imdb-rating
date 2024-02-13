import { Router } from 'express';
import { RatingsDTO, SeasonDTO } from '../../shared/RatingsDTO';
import { createReadStream } from 'fs';
import * as path from 'path';
import * as readline from 'readline';

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
	const episodes: Array<{ id: string, season: number, episode: number }> = [];
	const episodeIds = new Set<string>();
	const ratings = new Map<string, {rating: string, votes: string}>();

	const episodesFileStream = createReadStream(path.resolve(__dirname, '../imdb-dataset/episodes.tsv'));

	const episodesReadline = readline.createInterface({
		input: episodesFileStream,
		crlfDelay: Infinity
	});

	let isFirstLine = true;

	for await (const line of episodesReadline) {
		if (isFirstLine) {
			isFirstLine = false;
			continue;
		}

		const [id, parentTconst, season, episode] = line.split('\t');

		if (parentTconst === imdbId) {
			episodes.push({
				id,
				season: parseInt(season),
				episode: parseInt(episode)
			});
			episodeIds.add(id);
		}
	}

	const ratingsFileStream = createReadStream(path.resolve(__dirname, '../imdb-dataset/ratings.tsv'));

	const ratingsReadline = readline.createInterface({
		input: ratingsFileStream,
		crlfDelay: Infinity
	});

	isFirstLine = true;

	for await (const line of ratingsReadline) {
		if (isFirstLine) {
			isFirstLine = false;
			continue;
		}

		const [tconst, averageRating, numVotes] = line.split('\t');

		if (episodeIds.has(tconst)) {
			ratings.set(tconst, {
				rating: averageRating,
				votes: numVotes
			});
		}
	}

	const seasons = new Map<number, SeasonDTO>();
	for (let episode of episodes) {
		const season = seasons.get(episode.season) || { season: episode.season, episodes: [] };
		const rating = ratings.get(episode.id)!;
		season.episodes.push({
			episode: episode.episode,
			rating: parseFloat(rating.rating),
			votes: parseInt(rating.votes)
		});
		seasons.set(episode.season, season);
	}

	return {
		seasons: Array.from(seasons.values())
			.sort((a, b) => a.season - b.season)
			.map((season) => ({
				season: season.season,
				episodes: season.episodes.sort((a, b) => a.episode - b.episode)
			}))
	};
}
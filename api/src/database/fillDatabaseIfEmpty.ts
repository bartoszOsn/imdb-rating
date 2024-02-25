import { datasource } from './datasource';
import { TvShowEntity } from './entity/TvShowEntity';
import { EntityManager, Repository } from 'typeorm';
import { TsvReader } from '../util/TsvReader';
import { imdbEpisodesPath, imdbRatingsPath, imdbTitlesPath } from '../datasets/imdb-datasets';
import { EpisodeEntity } from './entity/EpisodeEntity';
import { parseNumberOrElse } from '../util/parseNumberOrElse';
import { loggable } from '../util/loggable';
import { resolveDatasets } from '../datasets/resolveDatasets';

const CHUNK_SIZE = 500;

let databaseUpdating = false;

export function isDatabaseUpdating(): boolean {
	return databaseUpdating;
}

export const fillDatabaseIfEmpty = loggable('filling database if empty', async function fillDatabaseIfEmpty(): Promise<void> {
	if (await datasource.manager.count(TvShowEntity) > 0) {
		return;
	}

	databaseUpdating = true;

	await resolveDatasets();

	await fillDatabase();

	databaseUpdating = false;
});

export const fillDatabase = loggable('filling database', async function fillDatabase(): Promise<void> {
	const tvShowRepository = datasource.getRepository(TvShowEntity);
	// const episodeRepository = datasource.getRepository(EpisodeEntity);

	await fillTvShows(tvShowRepository);

	await fillEpisodes(datasource.manager);

	await fillRatings(datasource.manager);
});

const fillTvShows = loggable('filling tv shows', async function fillTvShows(tvShowRepository: Repository<TvShowEntity>): Promise<void> {
	const tvShowReader = new TsvReader(
		imdbTitlesPath,
		[
			'tconst',
			'titleType',
			'primaryTitle',
			'originalTitle',
			'isAdult',
			'startYear',
			'endYear',
			'runtimeMinutes',
			'genres'
		] as const
	);

	for await (const tvShows of tvShowReader.readMultiple(CHUNK_SIZE, tvShow => tvShow.titleType === 'tvSeries')) {
		const tvShowEntities = tvShows
			.map(tvShow => {
				const tvShowEntity = new TvShowEntity();
				tvShowEntity.id = tvShow.tconst;
				tvShowEntity.title = tvShow.primaryTitle;
				tvShowEntity.originalTitle = tvShow.originalTitle;
				return tvShowEntity;
			});

		await tvShowRepository.save(tvShowEntities);
	}
});

export const fillEpisodes = loggable('filling episodes', async function fillEpisodes(manager: EntityManager): Promise<void> {
	const episodeReader = new TsvReader(
		imdbEpisodesPath,
		[
			'tconst',
			'parentTconst',
			'seasonNumber',
			'episodeNumber'
		] as const
	);

	for await (const episodes of episodeReader.readMultiple(CHUNK_SIZE)) {

		const episodeEntities = episodes.map(episode => {
			const episodeEntity = new EpisodeEntity();
			episodeEntity.id = episode.tconst;
			episodeEntity.season = parseNumberOrElse(episode.seasonNumber, -1);
			episodeEntity.episode = parseNumberOrElse(episode.episodeNumber, -1);
			episodeEntity.tvShowId = episode.parentTconst;
			episodeEntity.rating = 0;
			episodeEntity.votes = 0;
			return episodeEntity;
		});

		await manager.save(episodeEntities);
	}
});

export const fillRatings = loggable('filling ratings', async function fillRatings(manager: EntityManager): Promise<void> {
	const episodeReader = new TsvReader(
		imdbRatingsPath,
		[
			'tconst',
			'averageRating',
			'numVotes'
		] as const
	);

	for await (const rating of episodeReader.read()) {

		const episodeEntityPartial = {
			rating: parseNumberOrElse(rating.averageRating, 0),
			votes: parseNumberOrElse(rating.numVotes, 0),
		};

		await manager.update(EpisodeEntity, rating.tconst, episodeEntityPartial);
	}
});
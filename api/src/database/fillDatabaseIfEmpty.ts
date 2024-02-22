import { datasource } from './datasource';
import { TvShowEntity } from './entity/TvShowEntity';
import { EntityManager, Repository } from 'typeorm';
import { TsvReader } from '../util/TsvReader';
import { imdbEpisodesPath, imdbRatingsPath, imdbTitlesPath } from '../datasets/imdb-datasets';
import { EpisodeEntity } from './entity/EpisodeEntity';
import { parseNumberOrElse } from '../util/parseNumberOrElse';
import { resolveDatasets } from '../datasets/resolveDatasets';

const CHUNK_SIZE = 500;

export async function fillDatabaseIfEmpty(): Promise<void> {
	if (await datasource.manager.count(TvShowEntity) > 0) {
		return;
	}

	await resolveDatasets();

	await fillDatabase();
}

async function fillDatabase(): Promise<void> {
	console.log('Filling database');
	const tvShowRepository = datasource.getRepository(TvShowEntity);
	// const episodeRepository = datasource.getRepository(EpisodeEntity);

	console.log('filling tv shows');
	await fillTvShows(tvShowRepository);

	console.log('filling episodes');
	await fillEpisodes(datasource.manager);

	console.log('filling ratings');
	await fillRatings(datasource.manager);

	console.log('database filled');
}

async function fillTvShows(tvShowRepository: Repository<TvShowEntity>): Promise<void> {
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
}

async function fillEpisodes(manager: EntityManager): Promise<void> {
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
}

async function fillRatings(manager: EntityManager): Promise<void> {
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
}
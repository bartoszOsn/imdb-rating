import { datasource } from './datasource';
import { TvShowEntity } from './entity/TvShowEntity';
import { QueryBuilder } from 'typeorm';
import { TsvReader } from '../util/TsvReader';
import { imdbEpisodesPath, imdbRatingsPath, imdbTitlesPath } from '../datasets/imdb-datasets';
import { EpisodeEntity } from './entity/EpisodeEntity';
import { parseNumberOrElse } from '../util/parseNumberOrElse';
import { loggable } from '../util/loggable';
import { RatingEntity } from './entity/RatingEntity';
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

export const fillDatabase = loggable(
	'filling database',
	async function fillDatabase(): Promise<void> {

		const queryRunner = datasource.createQueryRunner();

		try {
			await queryRunner.connect();
			const queryBuilder = datasource.createQueryBuilder(queryRunner);

			await queryRunner.startTransaction();

			await fillTvShows(queryBuilder)
			await fillEpisodes(queryBuilder);
			await fillRatings(queryBuilder);

			await queryRunner.commitTransaction();
		} catch (error) {
			console.error('Error while filling database', error);
			await queryRunner.rollbackTransaction();
		}
	}
);

const fillTvShows = loggable(
	'filling tv shows',
	async function fillTvShows(queryBuilder: QueryBuilder<any>): Promise<void> {
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
					tvShowEntity.startYear = parseNumberOrElse(tvShow.startYear, -1);
					tvShowEntity.endYear = parseNumberOrElse(tvShow.endYear, tvShowEntity.startYear);
					return tvShowEntity;
				});

			await queryBuilder.insert().into(TvShowEntity).values(tvShowEntities).execute();
		}
	}
);

export const fillEpisodes = loggable('filling episodes', async function fillEpisodes(queryBuilder: QueryBuilder<any>): Promise<void> {
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
			return episodeEntity;
		});

		await queryBuilder.insert().into(EpisodeEntity).values(episodeEntities).execute();
	}
});

export const fillRatings = loggable('filling ratings', async function fillRatings(queryBuilder: QueryBuilder<any>): Promise<void> {
	const episodeReader = new TsvReader(
		imdbRatingsPath,
		[
			'tconst',
			'averageRating',
			'numVotes'
		] as const
	);

	for await (const ratings of episodeReader.readMultiple(CHUNK_SIZE)) {

		const ratingEntities = ratings.map(rating => ({
			id: rating.tconst,
			averageRating: parseNumberOrElse(rating.averageRating, 0),
			numVotes: parseNumberOrElse(rating.numVotes, 0)
		} as Partial<RatingEntity>));

		await queryBuilder.insert().into(RatingEntity).values(ratingEntities).execute();
	}
});
import { datasource } from './datasource';
import { TvShowEntity } from './entity/TvShowEntity';
import { Repository } from 'typeorm';
import { TsvReader } from '../util/TsvReader';
import { imdbTitlesPath } from './imdb-datasets';

export async function fillDatabaseIfEmpty(): Promise<void> {
	if (await datasource.manager.count(TvShowEntity) > 0) {
		return;
	}

	await fillDatabase();
}

async function fillDatabase(): Promise<void> {
	console.log('Filling database');
	const tvShowRepository = datasource.getRepository(TvShowEntity);
	// const episodeRepository = datasource.getRepository(EpisodeEntity);

	await fillTvShows(tvShowRepository);
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
	
	for await (const tvShow of tvShowReader.read()) {
		if (tvShow.titleType !== 'tvSeries') {
			continue;
		}

		const tvShowEntity = new TvShowEntity();
		tvShowEntity.id = tvShow.tconst;
		tvShowEntity.title = tvShow.primaryTitle;
		tvShowEntity.originalTitle = tvShow.originalTitle;
		tvShowEntity.episodes = Promise.resolve([]);
		await tvShowRepository.save(tvShowEntity);
	}
}
import { DataSource } from 'typeorm';
import { EpisodeEntity } from './entity/EpisodeEntity';
import { TvShowEntity } from './entity/TvShowEntity';

export const datasource = new DataSource({
	type: 'sqlite',
	database: 'data.db',
	entities: [
		EpisodeEntity,
		TvShowEntity
	],
	synchronize: true,
	logging: false
});

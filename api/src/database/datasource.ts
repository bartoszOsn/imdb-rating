import { DataSource } from 'typeorm';
import { EpisodeEntity } from './entity/EpisodeEntity';
import { TvShowEntity } from './entity/TvShowEntity';
import { RatingEntity } from './entity/RatingEntity';

export const datasource = new DataSource({
	type: 'sqlite',
	database: 'data.db',
	entities: [
		EpisodeEntity,
		TvShowEntity,
		RatingEntity
	],
	synchronize: true,
	logging: false
});

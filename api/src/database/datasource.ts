import { DataSource } from 'typeorm';

export const datasource = new DataSource({
	type: 'sqlite',
	database: 'data.db',
	entities: [__dirname + '/entity/**/*.ts'],
	synchronize: true,
	logging: false
});

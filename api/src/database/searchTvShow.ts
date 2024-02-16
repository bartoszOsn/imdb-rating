import { TvShowEntity } from './entity/TvShowEntity';
import { datasource } from './datasource';
import { Like } from 'typeorm';

export function searchTvShow(query: string): Promise<Array<TvShowEntity>> {
	return datasource.manager.find(TvShowEntity, {
		where: [
			{
				title: Like(`%${query}%`)
			},
			{
				originalTitle: Like(`%${query}%`)
			}
		]

	})
}
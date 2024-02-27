import { RatingEntity } from './entity/RatingEntity';
import { datasource } from './datasource';
import { In } from 'typeorm';

export function getRatingsByIds(ids: Array<string>): Promise<Array<RatingEntity>> {
	return datasource.manager.findBy(RatingEntity, {
		id: In(ids)
	})
}
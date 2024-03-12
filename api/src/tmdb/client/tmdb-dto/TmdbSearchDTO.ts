import { TmdbShowDTO } from './TmdbShowDTO';

export interface TmdbSearchDTO {
	results: Array<TmdbShowDTO>;
}
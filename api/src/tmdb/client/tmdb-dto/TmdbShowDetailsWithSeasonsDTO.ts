import { TmdbShowDetailsDTO } from './TmdbShowDetailsDTO';
import { TmdbSeasonDTO } from './TmdbSeasonDTO';

export interface TmdbShowDetailsWithSeasonsDTO extends TmdbShowDetailsDTO {
	[seasonNumber: `season/${number}`]: TmdbSeasonDTO;
}
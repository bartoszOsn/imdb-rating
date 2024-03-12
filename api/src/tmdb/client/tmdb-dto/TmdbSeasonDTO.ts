import { TmdbEpisodeDTO } from './TmdbEpisodeDTO';

export interface TmdbSeasonDTO {
	episodes: Array<TmdbEpisodeDTO>;
	season_number: number;
}
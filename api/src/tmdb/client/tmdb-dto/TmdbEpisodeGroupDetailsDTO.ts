import { TmdbEpisodeDTO } from './TmdbEpisodeDTO';

export interface TmdbEpisodeGroupDetailsDTO {
	groups: Array<{
		episodes: Array<TmdbEpisodeDTO>;
	}>;
}
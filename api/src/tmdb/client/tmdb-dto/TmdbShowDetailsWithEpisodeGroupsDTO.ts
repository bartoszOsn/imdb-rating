import { TmdbShowDetailsDTO } from './TmdbShowDetailsDTO';
import { TmdbEpisodeGroupsDTO } from './TmdbEpisodeGroupsDTO';

export interface TmdbShowDetailsWithEpisodeGroupsDTO extends TmdbShowDetailsDTO {
	episode_groups: TmdbEpisodeGroupsDTO;
}
import { tmdbEpisodeDTOToEpisodeDTO } from './tmdbEpisodeDTOToEpisodeDTO';
import { SeasonDTO } from '../../../../shared/RatingsDTO';
import { TmdbSeasonDTO } from '../client/tmdb-dto/TmdbSeasonDTO';

export function tmdbSeasonDTOToSeasonDTO(tmdbDto: TmdbSeasonDTO): SeasonDTO {
	return {
		season: tmdbDto.season_number,
		episodes: tmdbDto.episodes.map(episode => tmdbEpisodeDTOToEpisodeDTO(episode))
	}
}
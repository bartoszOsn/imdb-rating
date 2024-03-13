import { TmdbEpisodeDTO } from '../client/tmdb-dto/TmdbEpisodeDTO';
import { EpisodeDTO } from '../../../../shared/RatingsDTO';

export function tmdbEpisodeDTOToEpisodeDTO(tmdbDto: TmdbEpisodeDTO): EpisodeDTO {
	return {
		episode: tmdbDto.episode_number,
		rating: tmdbDto.vote_average,
		votes: tmdbDto.vote_count,
		name: tmdbDto.name,
		overview: tmdbDto.overview,
		season_number: tmdbDto.season_number
	}
}
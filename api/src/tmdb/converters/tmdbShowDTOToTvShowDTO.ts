import { TvShowDTO } from '../../../../shared/SearchShowResultDTO';
import { TmdbShowDTO } from '../client/tmdb-dto/TmdbShowDTO';

export function tmdbShowDTOToTvShowDTO(tmdbDto: TmdbShowDTO): TvShowDTO {
	return {
		id: tmdbDto.id.toString(),
		name: tmdbDto.name,
		startYear: new Date(tmdbDto.first_air_date).getFullYear(),
		rating: tmdbDto.vote_average,
		overview: tmdbDto.overview,
		posterPath: tmdbDto.poster_path
	};
}
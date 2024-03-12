import { TmdbSearchDTO } from '../client/tmdb-dto/TmdbSearchDTO';
import { SearchShowResultDTO, TvShowDTO } from '../../../../shared/SearchShowResultDTO';
import { tmdbShowDTOToTvShowDTO } from './tmdbShowDTOToTvShowDTO';

export function tmdbSearchDtoToSearchShowResultDTO(tmdbDto: TmdbSearchDTO): SearchShowResultDTO {
	const tvShows: Array<TvShowDTO> = tmdbDto.results.map(tmdbShowDTOToTvShowDTO);
	return { shows: tvShows };
}
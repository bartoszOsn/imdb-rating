import { TmdbTrendingDTO } from '../client/tmdb-dto/TmdbTrendingDTO';
import { TrendingDTO } from '../../../../shared/TrendingDTO';
import { TvShowDTO } from '../../../../shared/SearchShowResultDTO';
import { tmdbShowDTOToTvShowDTO } from './tmdbShowDTOToTvShowDTO';

export function tmdbTrendingDTOToTrendingDTO(tmdbDto: TmdbTrendingDTO): TrendingDTO {
	const tvShows: Array<TvShowDTO> = tmdbDto.results.map(tmdbShowDTOToTvShowDTO);
	return { results: tvShows };
}
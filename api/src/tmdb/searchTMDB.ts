import { SearchShowResultDTO } from '../../../shared/SearchShowResultDTO';
import { tmdb } from './tmdb';
import { tmdbSearchDtoToSearchShowResultDTO } from './converters/tmdbSearchDtoToSearchShowResultDTO';

export async function searchTMDB(query: string): Promise<SearchShowResultDTO> {
	return tmdb.searchTv(query)
		.then(tmdbSearchDtoToSearchShowResultDTO);
}

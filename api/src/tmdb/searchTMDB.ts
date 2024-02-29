import { SearchShowResultDTO, TvShowDTO } from '../../../shared/SearchShowResultDTO';
import { fetchTMDB } from './fetchTMDB';

export async function searchTMDB(query: string): Promise<SearchShowResultDTO> {
	return fetchTMDB<TMDBResponse>(`/search/tv?query=${query}`)
		.then((response) => {
			const tvShows: Array<TvShowDTO> = response.results.map((show) => ({
				id: show.id.toString(),
				name: show.name,
				startYear: new Date(show.first_air_date).getFullYear(),
				endYear: new Date(show.first_air_date).getFullYear(), // TODO: Get the actual end year
				rating: show.vote_average, // TODO: Get the actual rating
			}));
			return { shows: tvShows };
		});
}

interface TMDBResponse {
	results: Array<{
		id: number;
		name: string;
		overview: string;
		poster_path: string;
		first_air_date: string;
		vote_average: number;
	}>;
}
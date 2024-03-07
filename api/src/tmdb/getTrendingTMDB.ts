import { TrendingDTO } from '../../../shared/TrendingDTO';
import { fetchTMDB } from './fetchTMDB';

export function getTrendingTMDB(): Promise<TrendingDTO> {
	return fetchTMDB<Trending>('/trending/tv/day')
		.then((trending) => {
			return {
				results: trending.results.map((show) => ({
					id: show.id,
					name: show.name,
					overview: show.overview,
					posterPath: show.poster_path
				}))
			};
		});
}

interface Trending {
	results: Array<{
		id: number;
		name: string;
		overview: string;
		poster_path: string;
	}>;
}
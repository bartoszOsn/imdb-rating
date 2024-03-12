import { TrendingDTO } from '../../../shared/TrendingDTO';
import { tmdb } from './tmdb';
import { tmdbTrendingDTOToTrendingDTO } from './converters/tmdbTrendingDTOToTrendingDTO';

export async function getTrendingTMDB(): Promise<TrendingDTO> {
	const trending = await tmdb.trendingTv();
	return tmdbTrendingDTOToTrendingDTO(trending);
}

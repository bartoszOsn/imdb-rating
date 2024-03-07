import { baseUrl } from './baseUrl.ts';
import { TrendingDTO } from '../../../shared/TrendingDTO.ts';

export async function trendingRequest(): Promise<TrendingDTO> {
	const response = await fetch(`${baseUrl}/trending`);
	return await response.json();
}
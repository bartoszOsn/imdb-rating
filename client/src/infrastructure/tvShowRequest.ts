import { RatingsDTO } from '../../../shared/RatingsDTO.ts';
import { baseUrl } from './baseUrl.ts';

export function tvShowRequest(id: string): Promise<RatingsDTO> {
	return fetch(`${baseUrl}/ratings?imdbId=${id}`)
		.then((response) => response.json());
}
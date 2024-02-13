import { RatingsDTO } from '../../../shared/RatingsDTO.ts';

export function tvShowRequest(id: string): Promise<RatingsDTO> {
	return fetch(`/api/ratings?imdbId=${id}`)
		.then((response) => response.json());
}
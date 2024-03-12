import { TmdbUrl } from './TmdbUrl';
import { TmdbSearchDTO } from './tmdb-dto/TmdbSearchDTO';
import { TmdbTrendingDTO } from './tmdb-dto/TmdbTrendingDTO';
import { TmdbShowDetailsDTO } from './tmdb-dto/TmdbShowDetailsDTO';
import { TmdbShowDetailsWithSeasonsDTO } from './tmdb-dto/TmdbShowDetailsWithSeasonsDTO';
import { chunkArray } from '../../util/chunkArray';
import { TmdbShowDetailsWithEpisodeGroupsDTO } from './tmdb-dto/TmdbShowDetailsWithEpisodeGroupsDTO';
import { TmdbEpisodeGroupDetailsDTO } from './tmdb-dto/TmdbEpisodeGroupDetailsDTO';

export class TmdbClient {
	constructor(private readonly apiKey: string) {}

	searchTv(query: string): Promise<TmdbSearchDTO> {
		return this.fetch<TmdbSearchDTO>(`/search/tv?query=${query}`);
	}

	trendingTv(): Promise<TmdbTrendingDTO> {
		return this.fetch<TmdbTrendingDTO>('/trending/tv/day')
	}

	tvShowDetails(showId: string): Promise<TmdbShowDetailsDTO> {
		return this.fetch<TmdbShowDetailsDTO>(`/tv/${showId}`);
	}

	tvShowDetailsWithEpisodeGroups(showId: string): Promise<TmdbShowDetailsWithEpisodeGroupsDTO> {
		return this.fetch<TmdbShowDetailsWithEpisodeGroupsDTO>(`/tv/${showId}?append_to_response=episode_groups`);
	}

	async tvShowDetailsWithSeasons(showId: string, seasonNumbers: Array<number>): Promise<TmdbShowDetailsWithSeasonsDTO> {
		const seasonsInChunks = chunkArray(seasonNumbers, 20);
		let result: TmdbShowDetailsWithSeasonsDTO = {} as TmdbShowDetailsWithSeasonsDTO;

		for (const chunk of seasonsInChunks) {
			const seasons = chunk.map(seasonNumber => `season/${seasonNumber}`).join(',');
			const seasonsForChunk = await this.fetch<TmdbShowDetailsWithSeasonsDTO>(`/tv/${showId}?append_to_response=${seasons}`);

			result = {
				...result,
				...seasonsForChunk
			};
		}

		return result;
	}

	episodeGroupDetails(episodeGroupId: string): Promise<TmdbEpisodeGroupDetailsDTO> {
		return this.fetch<TmdbEpisodeGroupDetailsDTO>(`/tv/episode_group/${episodeGroupId}`);
	}

	private async fetch<TResponse>(endpoint: TmdbUrl): Promise<TResponse> {
		const options = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.apiKey}`,
			},
		};

		return fetch(`https://api.themoviedb.org/3${endpoint}`, options)
			.then((response) => {
				if (!response.ok) {
					throw response;
				}
				return response.json();
			});
	}
}
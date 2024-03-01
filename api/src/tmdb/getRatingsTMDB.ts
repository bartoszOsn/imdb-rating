import { RatingsDTO, SeasonDTO } from '../../../shared/RatingsDTO';
import { fetchTMDB } from './fetchTMDB';

export async function getRatingsTMDB(showId: string): Promise<RatingsDTO> {
	const group = await getTMDBEpisodeGroup(showId);
	const episodesDTO = await getTMDBEpisodes(group.id);

	const episodes = episodesDTO.groups
		.map(group => group.episodes)
		.flat();

	const seasons: Array<SeasonDTO> = [];

	for (const episode of episodes) {
		let season = seasons.find(season => season.season === episode.season_number);
		if (!season) {
			season = {
				season: episode.season_number,
				episodes: [],
			};
			seasons.push(season);
		}
		season!.episodes.push({
			episode: episode.episode_number,
			rating: episode.vote_average,
			votes: episode.vote_count,
		});
	}

	return {
		seasons: seasons
			.map(season => ({
				...season,
				episodes: season.episodes
					.sort((a, b) => a.episode - b.episode),

			}))
			.sort((a, b) => a.season - b.season),
	};
}

function getTMDBEpisodeGroup(showId: string): Promise<TMDBEpisodeGroup> {
	return fetchTMDB<TMDBEpisodeGroups>(`/tv/${showId}/episode_groups`)
		.then(groups => groups.results.sort((a, b) => a.type - b.type)[0]);
}

function getTMDBEpisodes(groupId: number): Promise<TMDBEpisodes> {
	return fetchTMDB<TMDBEpisodes>(`/tv/episode_group/${groupId}`);
}

interface TMDBEpisodeGroups {
	results: Array<TMDBEpisodeGroup>
}

interface TMDBEpisodeGroup {
	episode_count: number;
	id: number;
	type: number;
}

interface TMDBEpisodes {
	groups: Array<{
		order: number;
		episodes: Array<{
			episode_number: number;
			season_number: number;
			vote_average: number;
			vote_count: number;
		}>
	}>
}
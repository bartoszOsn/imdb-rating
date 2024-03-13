import { EpisodeDTO, RatingsDTO, SeasonDTO } from '../../../shared/RatingsDTO';
import { tmdb } from './tmdb';
import { TmdbSeasonDTO } from './client/tmdb-dto/TmdbSeasonDTO';
import { TmdbShowDetailsDTO } from './client/tmdb-dto/TmdbShowDetailsDTO';
import { TmdbShowDetailsWithEpisodeGroupsDTO } from './client/tmdb-dto/TmdbShowDetailsWithEpisodeGroupsDTO';
import { tmdbEpisodeDTOToEpisodeDTO } from './converters/tmdbEpisodeDTOToEpisodeDTO';

export async function getRatingsTMDB(showId: string): Promise<RatingsDTO> {
	const showDetails = await tmdb.tvShowDetailsWithEpisodeGroups(showId);

	const episodes = showDetails.episode_groups.results.length > 0
		? await getEpisodesTMDBFromGroups(showDetails)
		: await getEpisodesTMDBFromSeasons(showDetails);

	const seasons = episodeArrayToSeasons(episodes);

	return createRatingsDTO(showDetails, seasons);
}

async function getEpisodesTMDBFromGroups(showDetails: TmdbShowDetailsWithEpisodeGroupsDTO): Promise<Array<EpisodeDTO>> {
	const group = showDetails.episode_groups.results
		.sort((a, b) => b.episode_count - a.episode_count)[0];

	const episodeGroupDetails = await tmdb.episodeGroupDetails(group.id);
	const episodes = episodeGroupDetails.groups.flatMap(group => group.episodes);

	return episodes
		.sort((a, b) => new Date(a.air_date).getTime() - new Date(b.air_date).getTime())
		.map(tmdbEpisodeDTOToEpisodeDTO);
}

async function getEpisodesTMDBFromSeasons(showDetails: TmdbShowDetailsDTO): Promise<Array<EpisodeDTO>> {
	const seasonNumbers = showDetails.seasons.map(season => season.season_number);

	const showDetailsWithSeasons = await tmdb.tvShowDetailsWithSeasons(showDetails.id.toString(), seasonNumbers);
	const seasons: Array<TmdbSeasonDTO> = seasonNumbers.map(seasonNumber => showDetailsWithSeasons[`season/${seasonNumber}`]);

	return seasons
		.flatMap(season => season.episodes)
		.sort((a, b) => new Date(a.air_date).getTime() - new Date(b.air_date).getTime())
		.map(tmdbEpisodeDTOToEpisodeDTO);
}

function episodeArrayToSeasons(episodes: Array<EpisodeDTO>): Array<SeasonDTO> {
	if (episodes.length === 0) {
		return [];
	}

	const seasons: Array<SeasonDTO> = [];

	const fistEpisode = episodes.shift()!;
	let currentEpisodes: Array<EpisodeDTO> = [fistEpisode];

	for (const episode of episodes) {
		const lastFromCurrentEpisodes = currentEpisodes[currentEpisodes.length - 1];
		if (episode.season_number === lastFromCurrentEpisodes.season_number) {
			currentEpisodes.push(episode);
		} else {
			seasons.push({
				season: lastFromCurrentEpisodes.season_number,
				episodes: currentEpisodes
			});
			currentEpisodes = [episode];
		}
	}

	return seasons;
}

function createRatingsDTO(showDetails: TmdbShowDetailsDTO, ratings: Array<SeasonDTO>): RatingsDTO {
	return {
		seasons: ratings,
		name: showDetails.name,
		overview: showDetails.overview,
		rating: showDetails.vote_average,
		genres: showDetails.genres.map(genre => genre.name),
		posterPath: showDetails.poster_path,
		year: new Date(showDetails.first_air_date).getFullYear(),
		creators: showDetails.created_by.map(creator => creator.name),
		productionCountries: showDetails.production_countries.map(country => country.name),
		runtime: showDetails.episode_run_time[0]
	};
}
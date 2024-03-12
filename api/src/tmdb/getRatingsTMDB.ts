import { RatingsDTO, SeasonDTO } from '../../../shared/RatingsDTO';
import { tmdb } from './tmdb';
import { TmdbSeasonDTO } from './client/tmdb-dto/TmdbSeasonDTO';
import { tmdbSeasonDTOToSeasonDTO } from './converters/tmdbSeasonDTOToSeasonDTO';
import { TmdbShowDetailsDTO } from './client/tmdb-dto/TmdbShowDetailsDTO';
import { TmdbShowDetailsWithEpisodeGroupsDTO } from './client/tmdb-dto/TmdbShowDetailsWithEpisodeGroupsDTO';
import { TmdbEpisodeDTO } from './client/tmdb-dto/TmdbEpisodeDTO';
import { tmdbEpisodeDTOToEpisodeDTO } from './converters/tmdbEpisodeDTOToEpisodeDTO';

export async function getRatingsTMDB(showId: string): Promise<RatingsDTO> {
	const showDetails = await tmdb.tvShowDetailsWithEpisodeGroups(showId);

	if (showDetails.episode_groups.results.length > 0) {
		return getRatingsTMDBFromGroups(showDetails);
	} else {
		return getRatingsTMDBFromSeasons(showDetails);
	}
}

async function getRatingsTMDBFromGroups(showDetails: TmdbShowDetailsWithEpisodeGroupsDTO): Promise<RatingsDTO> {
	const group = showDetails.episode_groups.results.sort((a, b) => a.type - b.type)[0];

	const episodeGroupDetails = await tmdb.episodeGroupDetails(group.id);
	const episodes = episodeGroupDetails.groups.flatMap(group => group.episodes);

	const episodeToSeasonMap = new Map<number, Array<TmdbEpisodeDTO>>();

	for (const episode of episodes) {
		const seasonNumber = episode.season_number;
		const season = episodeToSeasonMap.get(seasonNumber) || [];
		season.push(episode);
		episodeToSeasonMap.set(seasonNumber, season);
	}

	const ratings: Array<SeasonDTO> = [...episodeToSeasonMap.entries()]
		.map(seasonEntry => {
			const [season, episodes] = seasonEntry;
			return {
				season,
				episodes: episodes.map(tmdbEpisodeDTOToEpisodeDTO)
			};
		});

	return createRatingsDTO(showDetails, ratings);
}

async function getRatingsTMDBFromSeasons(showDetails: TmdbShowDetailsDTO): Promise<RatingsDTO> {
	const seasonNumbers = showDetails.seasons.map(season => season.season_number);

	const showDetailsWithSeasons = await tmdb.tvShowDetailsWithSeasons(showDetails.id.toString(), seasonNumbers);
	const seasons: Array<TmdbSeasonDTO> = seasonNumbers.map(seasonNumber => showDetailsWithSeasons[`season/${seasonNumber}`]);

	const ratings: Array<SeasonDTO> = seasons.map(tmdbSeasonDTOToSeasonDTO);

	return createRatingsDTO(showDetails, ratings);
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
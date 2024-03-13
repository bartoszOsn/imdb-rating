import { RatingsDTO, SeasonDTO } from '../../../shared/RatingsDTO';
import { tmdb } from './tmdb';
import { TmdbSeasonDTO } from './client/tmdb-dto/TmdbSeasonDTO';
import { tmdbSeasonDTOToSeasonDTO } from './converters/tmdbSeasonDTOToSeasonDTO';

export async function getRatingsTMDB(showId: string): Promise<RatingsDTO> {
	const showDetails = await tmdb.tvShowDetails(showId);
	const seasonNumbers = showDetails.seasons.map(season => season.season_number);

	const showDetailsWithSeasons = await tmdb.tvShowDetailsWithSeasons(showId, seasonNumbers);
	const seasons: Array<TmdbSeasonDTO> = seasonNumbers.map(seasonNumber => showDetailsWithSeasons[`season/${seasonNumber}`]);

	const ratings: Array<SeasonDTO> = seasons
		.map(season => ({
			...season,
			episodes: season.episodes.filter(episode => episode.season_number !== 0)
		}))
		.filter(season => season.episodes.length > 0)
		.map(tmdbSeasonDTOToSeasonDTO);

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

import { RatingsDTO, SeasonDTO } from '../../../shared/RatingsDTO';
import { fetchTMDB } from './fetchTMDB';
import { chunkArray } from '../util/chunkArray';

export async function getRatingsTMDB(showId: string): Promise<RatingsDTO> {
	const showDetails = await getShowDetails(showId);
	const seasonNumbers = showDetails.seasons.map(season => season.season_number);

	const showDetailsWithSeasons = await getSeasonDetails(showId, seasonNumbers);
	const seasons: Array<ShowDetailsWithSeasons[`season/${number}`]> = seasonNumbers.map(seasonNumber => showDetailsWithSeasons[`season/${seasonNumber}`]);

	const ratings: Array<SeasonDTO> = seasons.map(season => {
		const episodes = season.episodes.map(episode => ({
			episode: episode.episode_number,
			rating: episode.vote_average,
			votes: episode.vote_count,
			name: episode.name,
			overview: episode.overview
		}));
		return {
			season: season.season_number,
			episodes
		};
	});

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

function getShowDetails(showId: string): Promise<ShowDetails> {
	return fetchTMDB<ShowDetails>(`/tv/${showId}`);
}

async function getSeasonDetails(showId: string, seasonNumbers: Array<number>): Promise<ShowDetailsWithSeasons> {
	 const seasonsInChunks = chunkArray(seasonNumbers, 20);
	 let result: ShowDetailsWithSeasons = {} as ShowDetailsWithSeasons;

	 for (const chunk of seasonsInChunks) {
		 const seasons = chunk.map(seasonNumber => `season/${seasonNumber}`).join(',');
		 const seasonsForChunk = await fetchTMDB<ShowDetailsWithSeasons>(`/tv/${showId}?append_to_response=${seasons}`);

		 result = {
			 ...result,
			 ...seasonsForChunk
		 };
	 }

	 return result;
}

interface ShowDetails {
	seasons: Array<{
		season_number: number;
	}>;
	genres: Array<{
		id: number;
		name: string;
	}>;
	name: string;
	overview: string;
	vote_average: number;
	poster_path: string;
	first_air_date: string;
	created_by: Array<{
		name: string;
	}>;
	episode_run_time: Array<number>;
	production_countries: Array<{
		name: string;
	}>;
}

interface ShowDetailsWithSeasons extends ShowDetails {
	[seasonNumber: `season/${number}`]: {
		episodes: Array<{
			id: number;
			episode_number: number;
			season_number: number;
			name: string;
			overview: string;
			air_date: string;
			runtime: number;
			vote_count: number;
			vote_average: number;
		}>;
		season_number: number;
	}
}
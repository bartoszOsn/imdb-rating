export interface TmdbEpisodeDTO {
	id: number;
	episode_number: number;
	season_number: number;
	name: string;
	overview: string;
	air_date: string;
	runtime: number;
	vote_count: number;
	vote_average: number;
}
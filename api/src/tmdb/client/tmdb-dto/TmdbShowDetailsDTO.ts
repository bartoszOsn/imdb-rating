export interface TmdbShowDetailsDTO {
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
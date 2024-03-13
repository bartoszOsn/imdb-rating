export interface RatingsDTO {
	seasons: Array<SeasonDTO>
	name: string;
	overview: string;
	rating: number;
	genres: Array<string>,
	posterPath: string;
	year: number;
	productionCountries: Array<string>;
	runtime?: number;
	creators: Array<string>;
}

export interface SeasonDTO {
	season: number;
	episodes: Array<EpisodeDTO>
}

export interface EpisodeDTO {
	episode: number;
	rating: number;
	votes: number;
	name: string;
	overview: string;
	season_number: number;
}
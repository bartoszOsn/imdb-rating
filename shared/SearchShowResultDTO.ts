export interface SearchShowResultDTO {
	shows: Array<TvShowDTO>;
}

export interface TvShowDTO {
	id: string;
	name: string;
	startYear: number;
	rating: number;
	overview: string;
	posterPath: string;
}
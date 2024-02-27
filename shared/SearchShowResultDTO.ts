export interface SearchShowResultDTO {
	shows: Array<TvShowDTO>;
}

export interface TvShowDTO {
	id: string;
	name: string;
	startYear: number;
	endYear: number;
	rating: number;
}
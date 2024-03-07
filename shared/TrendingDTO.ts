export interface TrendingDTO {
	results: Array<TrendingShowDTO>
}

export interface TrendingShowDTO {
	id: number;
	name: string;
	overview: string;
	posterPath: string;
}
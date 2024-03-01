export interface RatingsDTO {
	seasons: Array<SeasonDTO>
}

export interface SeasonDTO {
	season: number;
	episodes: Array<EpisodeDTO>
}

export interface EpisodeDTO {
	episode: number;
	rating: number;
	votes: number;
}
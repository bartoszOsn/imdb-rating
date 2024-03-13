export interface TmdbEpisodeGroupsDTO {
	results: Array<{
		type: number;
		id: string;
		episode_count: number,
	}>;
}
import { SearchShowResultDTO } from '../../../shared/SearchShowResultDTO.ts';

export async function searchRequest(query: string, abort: AbortSignal): Promise<SearchShowResultDTO> {
  const response = await fetch(`/api/search?query=${query}`, { signal: abort });
  return await response.json();
}
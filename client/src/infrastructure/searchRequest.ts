import { SearchShowResultDTO } from '../../../shared/SearchShowResultDTO.ts';
import { baseUrl } from './baseUrl.ts';

export async function searchRequest(query: string, abort: AbortSignal): Promise<SearchShowResultDTO> {
  const response = await fetch(`${baseUrl}/search?query=${query}`, { signal: abort });
  return await response.json();
}
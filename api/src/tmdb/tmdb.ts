import { TmdbClient } from './client/TmdbClient';

if (!process.env.TMDB_API_KEY) {
	throw new Error('TMDB_API_KEY is not set');
}

export const tmdb = new TmdbClient(process.env.TMDB_API_KEY);
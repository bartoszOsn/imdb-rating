import { downloadAndUnzip } from './downloadAndUnzip';
import { imdbEpisodesPath, imdbEpisodesUrl, imdbRatingsPath, imdbRatingsUrl, imdbTitlesPath, imdbTitlesUrl } from './imdb-datasets';
import { loggable } from '../util/loggable';

export const resolveDatasets = loggable('resolving datasets', async function resolveDatasets(): Promise<void> {
	await downloadAndUnzip(imdbTitlesUrl, imdbTitlesPath);
	await downloadAndUnzip(imdbEpisodesUrl, imdbEpisodesPath);
	await downloadAndUnzip(imdbRatingsUrl, imdbRatingsPath);
});
import { downloadAndUnzip } from './downloadAndUnzip';
import { imdbEpisodesPath, imdbEpisodesUrl, imdbRatingsPath, imdbRatingsUrl, imdbTitlesPath, imdbTitlesUrl } from './imdb-datasets';

export async function resolveDatasets(): Promise<void> {
	await downloadAndUnzip(imdbTitlesUrl, imdbTitlesPath);
	await downloadAndUnzip(imdbEpisodesUrl, imdbEpisodesPath);
	await downloadAndUnzip(imdbRatingsUrl, imdbRatingsPath);
}
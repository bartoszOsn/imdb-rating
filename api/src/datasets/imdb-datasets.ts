import * as path from 'path';

export const imdbTitlesPath = path.join(__dirname, '../../imdb-dataset/titles.tsv');
export const imdbEpisodesPath = path.join(__dirname, '../../imdb-dataset/episodes.tsv');
export const imdbRatingsPath = path.join(__dirname, '../../imdb-dataset/ratings.tsv');

export const imdbTitlesUrl = 'https://datasets.imdbws.com/title.basics.tsv.gz';
export const imdbEpisodesUrl = 'https://datasets.imdbws.com/title.episode.tsv.gz';
export const imdbRatingsUrl = 'https://datasets.imdbws.com/title.ratings.tsv.gz';
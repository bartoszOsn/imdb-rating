import { Router } from 'express';
import { SearchShowResultDTO, TvShowDTO } from '../../shared/SearchShowResultDTO';
import { createReadStream } from 'fs';
import * as readline from 'readline';
import * as path from 'path';

const router = Router();

router.get('/search', (req, res) => {
	const { query } = req.query;

	if (!query) {
		res.status(400).send('Missing query parameter');
		return;
	}

	getTitles(query as string)
		.then((titles) => {
			const dto: SearchShowResultDTO = {
				shows: titles
			}
			res.json(dto);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('An error occurred');
		});
})

export { router as searchRoute };

async function getTitles(query: string): Promise<TvShowDTO[]> {
	const results: TvShowDTO[] = [];
	const fileStream = createReadStream(path.resolve(__dirname, '../imdb-dataset/titles.tsv'));
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let isFirstLine = true;

	for await (const line of rl) {
		if (isFirstLine) {
			isFirstLine = false;
			continue;
		}

		const [id, type, title, originalTitle] = line.split('\t');

		if (type !== 'tvSeries') {
			continue;
		}

		if (title.toLowerCase().includes(query.toLowerCase()) || originalTitle.toLowerCase().includes(query.toLowerCase())) {
			results.push({
				id,
				name: title
			});
		}
	}

	return results;
}
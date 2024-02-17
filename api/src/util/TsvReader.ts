import { createReadStream } from 'fs';
import readline from 'readline';

export class TsvReader<TColumns extends Array<string>> {
	private readonly separator = '\t';

	constructor(
		private readonly path: string,
		private readonly columns: TColumns
	) {
	}

	async *read(): AsyncGenerator<Record<TColumns[number], string>> {
		const fileStream = createReadStream(this.path);
		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity
		});

		let isFirstLine = true;

		for await (const line of rl) {
			if (isFirstLine) {
				const columnNames = line.split(this.separator);
				this.validateColumns(columnNames);
				isFirstLine = false;
				continue;
			}

			const values = line.split('\t') as string[];
			const record: Record<TColumns[number], string> = {} as Record<TColumns[number], string>;

			for (const [index, column] of this.columns.entries()) {
				record[column as TColumns[typeof index]] = values[index];
			}

			yield record;
		}
		rl.close();
	}

	async *readMultiple(
		chunkSize: number,
		filter: (value: Record<TColumns[number], string>) => boolean = () => true
	): AsyncGenerator<Array<Record<TColumns[number], string>>> {
		let readValues: Array<Record<TColumns[number], string>> = [];

		for await (const value of this.read()) {
			if (!filter(value)) {
				continue;
			}

			readValues.push(value);

			if (readValues.length === chunkSize) {
				yield readValues;
				readValues = [];
			}
		}
	}

	private validateColumns(columnNames: string[]): void {
		if (columnNames.length !== this.columns.length) {
			throw new Error('Invalid number of columns');
		}

		for (const [index, columnName] of columnNames.entries()) {
			if (columnName !== this.columns[index]) {
				throw new Error(`Invalid column name at index ${index}`);
			}
		}
	}
}
import { get } from 'https';
import { createWriteStream } from 'fs';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream';

export async function downloadAndUnzip(gzUrl: string, destPath: string): Promise<void> {
	console.log(`Downloading and unzipping ${gzUrl} to ${destPath}`);
	const file = createWriteStream(destPath);
	const gzip = createGunzip();
	return new Promise((resolve, reject) => {
		get(gzUrl, (res) => {
			pipeline(res, gzip, file, (err) => {
				file.close();
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	});
}
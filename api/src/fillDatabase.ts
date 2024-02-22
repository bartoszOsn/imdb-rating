import { datasource } from './database/datasource';
import { fillDatabaseIfEmpty } from './database/fillDatabaseIfEmpty';

datasource.initialize()
	.then(() => fillDatabaseIfEmpty());
import { SearchComponent } from '../util/components/SearchComponent.tsx';
import { useDebouncedState } from '../util/useDebouncedState.ts';
import { ReactNode, useEffect, useState } from 'react';
import { TvShowDTO } from '../../../shared/SearchShowResultDTO.ts';
import { searchRequest } from '../infrastructure/searchRequest.ts';
import { Link } from 'react-router-dom';

export const SearchShowComponent = () => {
	const [search, setSearch] = useDebouncedState('', 500);

	const [isFetching, setIsFetching] = useState(false);
	const [isError, setIsError] = useState(false);
	const [results, setResults] = useState<Array<TvShowDTO>>([]);

	const hide = () => {
		setResults([]);
		setSearch('');
	}

	useEffect(() => {
		if (search.length === 0) {
			setResults([]);
			return;
		}

		const abortController = new AbortController();
		const signal = abortController.signal;
		setIsFetching(true);
		setIsError(false);
		searchRequest(search, signal)
			.then((results) => {
				setResults(results.shows);
			})
			.catch(() => {
				if (signal.aborted) {
					return;
				}
				setIsError(true);
			})
			.finally(() => {
				if (signal.aborted) {
					return;
				}
				setIsFetching(false);
			});

		return () => {
			abortController.abort();
		}
	}, [search]);

	let dropdownContent: ReactNode = null;

	if (search.length > 0) {
		if (isFetching) {
			dropdownContent = <div>Fetching...</div>;
		} else if (isError) {
			dropdownContent = <div>Error fetching results</div>;
		} else {
			dropdownContent = results.map((show) => (
				<Link to={`/tv-show/${show.id}`} key={show.id} onClick={hide}>{show.name}</Link>
			));
		}
	}

	return (
		<SearchComponent onInput={setSearch}>
			{
				dropdownContent
			}
		</SearchComponent>
	)
}
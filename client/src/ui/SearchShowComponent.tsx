import { SearchComponent } from '../util/components/SearchComponent.tsx';
import { useDebouncedState } from '../util/useDebouncedState.ts';
import { ReactNode, useEffect, useState } from 'react';
import { TvShowDTO } from '../../../shared/SearchShowResultDTO.ts';
import { searchRequest } from '../infrastructure/searchRequest.ts';
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { Skeleton } from '../util/components/Skeleton.tsx';


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
			dropdownContent = (
				<div className="flex flex-col gap-2 py-2">
					<SearchItemSkeleton />
					<SearchItemSkeleton />
					<SearchItemSkeleton />
				</div>
			)
		} else if (isError) {
			dropdownContent = <div>Error fetching results</div>;
		} else {
			dropdownContent = <div className="max-h-96 flex flex-col overflow-y-auto py-2">
				{
					results.map((show) => (
						<Link
							to={`/tv-show/${show.id}`}
							key={show.id}
							onClick={hide}
							className='flex flex-col gap-1 p-2 pt-1 hover:bg-backgroundDark'
						>
							{show.name}
							<div className='flex gap-2 text-textSubtle text-small'>
								<span>{show.startYear}</span>
								<span>
									<FontAwesomeIcon icon={faStar} /> {show.rating}
								</span>
							</div>
						</Link>
					))
				}
			</div>;
		}
	}

	return (
		<SearchComponent onInput={setSearch} placeholder='Search tv show'>
			{
				dropdownContent
			}
		</SearchComponent>
	)
}

const SearchItemSkeleton = () => (
	<div className='flex flex-col gap-1 p-2 pt-1'>
		<Skeleton className='w-3/4 h-4' />
		<div className='flex gap-2'>
			<Skeleton className='w-8 h-2' />
			<Skeleton className='w-8 h-2' />
		</div>
	</div>
)
import { SearchComponent } from '../util/components/SearchComponent.tsx';
import { useDebouncedState } from '../util/useDebouncedState.ts';
import { ReactNode, useEffect, useState } from 'react';
import { TvShowDTO } from '../../../shared/SearchShowResultDTO.ts';
import { searchRequest } from '../infrastructure/searchRequest.ts';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Colors, size, textSizes } from '../util/styles.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';


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
			dropdownContent = <DropdownContentComponent>
				{
					results.map((show) => (
						<DropdownContentItemComponent to={`/tv-show/${show.id}`} key={show.id} onClick={hide}>
							{show.name}
							<DropdownContentItemDetailsComponent>
								<span>{show.startYear}</span>
								<span>
									<FontAwesomeIcon icon={faStar} /> {show.rating}
								</span>
							</DropdownContentItemDetailsComponent>
						</DropdownContentItemComponent>
					))
				}
			</DropdownContentComponent>;
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

const DropdownContentComponent = styled.div`
	max-height: ${size(96)};
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	padding-top: ${size(2)};
	padding-bottom: ${size(2)};
`;

const DropdownContentItemComponent = styled(Link)`
	color: ${Colors.text.toString()};
	text-decoration: none;
	
	display: flex;
	flex-direction: column;
	gap: ${size(1)};
	
	padding-top: ${size(1)};
	padding-bottom: ${size(2)};
	padding-left: ${size(2)};
	padding-right: ${size(2)};
	
	
	&:hover {
		background-color: ${Colors.background.darken(0.1).toString()};
	}
`;

const DropdownContentItemDetailsComponent = styled.div`
	display: flex;
	gap: ${size(2)};
	color: ${Colors.textSubtle.toString()};
	font-size: ${textSizes.small};
`;
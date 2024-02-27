import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { RatingsDTO } from '../../../shared/RatingsDTO.ts';
import { tvShowRequest } from '../infrastructure/tvShowRequest.ts';
import styled from 'styled-components';
import { Colors, size, textSizes, zIndex } from '../util/styles.ts';

export const TvShowRoute = () => {
	const { id } = useParams<{ id: string }>();
	const [ratings, setRatings] = useState<RatingsDTO | null>(null);

	useEffect(() => {
		setRatings(null);
		if (!id) {
			// TODO handle error
			return;
		}

		tvShowRequest(id)
			.then(setRatings)
			.catch(console.error); // TODO handle error
	}, [id]);

	return (
		<div>
			{
				!ratings ? (
					<p>Loading</p>
				) : (
					<EpisodesTable ratings={ratings} />
				)
			}
		</div>
	);
}

const EpisodesTable = ({ ratings }: { ratings: RatingsDTO }) => {
	const allRatings = useMemo(
		() => ratings.seasons
			.flat()
			.flatMap((season) => season.episodes)
			.map((episode) => episode.rating),
		[ratings]
	)

	const maxRating = useMemo(() => Math.max(...allRatings), [allRatings]);
	const minRating = useMemo(() => Math.min(...allRatings), [allRatings]);
	const maxEpisodes = useMemo(
		() => Math.max(...ratings.seasons.map((season) => season.episodes.length)),
		[ratings]
	);
	const episodeNumbers = useMemo(() => Array.from({ length: maxEpisodes }, (_, i) => i + 1), [maxEpisodes]);

	const getRatingColor = (rating: number) => {
		const normalizedRating = (rating - minRating) / (maxRating - minRating);
		// const normalizedRating = maxRating / 10;

		if (normalizedRating < 0.5) {
			const color = Colors.danger.mix(Colors.waring, normalizedRating * 2);
			return color.toString();
		} else {
			const color = Colors.waring.mix(Colors.success, (normalizedRating - 0.5) * 2);
			return color.toString();
		}

		const color = Colors.danger.mix(Colors.success, normalizedRating);
		return color.toString();
	}

	return (
		<Table>
			<Column>
				<HeaderCell></HeaderCell>
				{
					episodeNumbers.map((episodeNumber) => (
							<HeaderCell>{episodeNumber}</HeaderCell>
					))
				}
			</Column>
			{
				ratings.seasons.map((season) => {
					return (
						<Column>
							<HeaderCell sticky={true}>{season.season}</HeaderCell>
							{
								season.episodes.map((episode) => {
									return (
										<Cell style={{ backgroundColor: getRatingColor(episode.rating)}}>
											{episode.rating}
										</Cell>
									);
								})
							}
						</Column>
					);
				})
			}
		</Table>
	);
};

const gap = size(0.5);

const Table = styled.div`
	display: flex;
	flex-direction: row;
	gap: ${gap};
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${gap};
`;

const Cell = styled.div<{ sticky?: true}>`
	width: ${size(6)};
	height: ${size(6)};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: ${textSizes.xs};
	z-index: ${props => props.sticky ? zIndex.elevated : zIndex.default };
	position: ${props => props.sticky ? 'sticky' : 'static'};
	top: 0;
	&:hover {
		outline: ${size(0.5)} solid ${Colors.primary.toString()};
	}
`

const HeaderCell = styled(Cell)`
	font-weight: bold;
	background-color: ${Colors.primary.toString()};
	color: ${Colors.background.toString()};
`
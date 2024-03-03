import { useParams } from 'react-router-dom';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { RatingsDTO } from '../../../shared/RatingsDTO.ts';
import { tvShowRequest } from '../infrastructure/tvShowRequest.ts';
import { Colors } from '../util/styles.ts';

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

		if (normalizedRating < 0.5) {
			const color = Colors.danger.mix(Colors.waring, normalizedRating * 2);
			return color.toString();
		} else {
			const color = Colors.waring.mix(Colors.success, (normalizedRating - 0.5) * 2);
			return color.toString();
		}
	}

	const columnClasses = 'flex flex-col gap-0.5';

	return (
		<div className='flex flex-row gap-0.5'>
			<div className={columnClasses}>
				<Cell header={true} highest={true}></Cell>
				{
					episodeNumbers.map((episodeNumber) => (
							<Cell header={true}>{episodeNumber}</Cell>
					))
				}
			</div>
			{
				ratings.seasons.map((season) => {
					return (
						<div className={columnClasses}>
							<Cell header={true}>{season.season}</Cell>
							{
								season.episodes.map((episode) => {
									return (
										<Cell color={getRatingColor(episode.rating)}>
											{episode.rating}
										</Cell>
									);
								})
							}
						</div>
					);
				})
			}
		</div>
	);
};

const Cell = (props: { children?: ReactNode, header?: boolean, color?: string, highest?: boolean}) => {
	let classNames = 'w-6 h-6 flex items-center justify-center text-xs hover:outline outline-primary outline-2';
	if (props.header) {
		classNames += ` font-bold bg-primary text-background sticky top-0 ${props.highest ? 'z-elevated-plus': 'z-elevated'}`;
	}

	return (
		<div className={classNames} style={{ backgroundColor: props.color}}>
			{props.children}
		</div>
	);
}
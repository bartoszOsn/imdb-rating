import { useParams } from 'react-router-dom';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { RatingsDTO } from '../../../shared/RatingsDTO.ts';
import { tvShowRequest } from '../infrastructure/tvShowRequest.ts';

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
	const maxEpisodes = useMemo(
		() => Math.max(...ratings.seasons.map((season) => season.episodes.length)),
		[ratings]
	);
	const episodeNumbers = useMemo(() => Array.from({ length: maxEpisodes }, (_, i) => i + 1), [maxEpisodes]);

	const normalizeRating = (rating: number) => {
		return Math.round(rating);
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
										<Cell scale={normalizeRating(episode.rating)}>
											{Math.round(episode.rating * 10) / 10}
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

const Cell = (props: { children?: ReactNode, header?: boolean, scale?: number, highest?: boolean}) => {
	let classNames = 'w-6 h-6 flex items-center justify-center text-xs hover:outline outline-primary outline-2';
	if (props.header) {
		classNames += ` font-bold bg-primary text-background sticky top-0 ${props.highest ? 'z-elevated-plus': 'z-elevated'}`;
	}

	if (props.scale !== undefined) {
		classNames += ' ' + getColorClass(props.scale);
	}

	return (
		<div className={classNames}>
			{props.children}
		</div>
	);
}

function getColorClass(rating: number): string {
	const classes = {
		0: 'bg-scale-0',
		1: 'bg-scale-1',
		2: 'bg-scale-2',
		3: 'bg-scale-3',
		4: 'bg-scale-4',
		5: 'bg-scale-5',
		6: 'bg-scale-6',
		7: 'bg-scale-7',
		8: 'bg-scale-8',
		9: 'bg-scale-9',
		10: 'bg-scale-10'
	}

	if (!(rating in classes)) {
		return 'bg-backgroundDark';
	}
	return classes[rating as keyof typeof classes];
}
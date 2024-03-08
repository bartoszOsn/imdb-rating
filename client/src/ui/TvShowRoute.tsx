import { useParams } from 'react-router-dom';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { EpisodeDTO, RatingsDTO } from '../../../shared/RatingsDTO.ts';
import { tvShowRequest } from '../infrastructure/tvShowRequest.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faClock } from '@fortawesome/free-regular-svg-icons';
import { imageTMDBBaseUrl } from '../imageTMDBBaseUrl.ts';
import { Tooltip } from '../util/components/tooltip/Tooltip.tsx';
import { EpisodeDetails } from './EpisodeDetails.tsx';
import { Chart } from '../util/components/chart';

export const TvShowRoute = () => {
	const {id} = useParams<{ id: string }>();
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
					<>
						<TvShowDetails ratings={ratings}/>
						<EpisodesChart ratings={ratings}/>
						<EpisodesTable ratings={ratings}/>
					</>
				)
			}
		</div>
	);
}

const TvShowDetails = ({ratings}: { ratings: RatingsDTO }) => {
	return (
		<div className="flex flex-row gap-4 mb-4">
			<img className="w-48" src={`${imageTMDBBaseUrl}${ratings.posterPath}`}/>
			<div>
				<h1>
					{ratings.name}
					<span className="text-textSubtle"> ({ratings.year})</span>
				</h1>
				<p className="text-textSubtle mb-4">{ratings.genres.join(', ')}</p>
				<p>{ratings.overview}</p>
				<div className="flex flex-row gap-4 mt-4 text-small text-textSubtle">
					<p className="flex flex-row gap-2 items-center">
						<FontAwesomeIcon icon={faStar}/> {Math.round(ratings.rating * 10) / 10}
					</p>
					{
						ratings.runtime && (
							<p className="flex flex-row gap-2 items-center">
								<FontAwesomeIcon icon={faClock}/> {ratings.runtime} min
							</p>
						)
					}
					<p>{ratings.creators.join(', ')}</p>
					<p>{ratings.productionCountries.join(', ')}</p>
				</div>
			</div>
		</div>
	)
}

const EpisodesChart = ({ratings}: { ratings: RatingsDTO }) => {
	const allEpisodes: Array<EpisodeDTO & { season: number}> = ratings.seasons
		.map((season) => season.episodes.map((episode) => ({...episode, season: season.season})))
		.flatMap((season) => season);

	return (
		<>
			<h2 className="mb-2">Episode chart</h2>
			<Chart nodes={allEpisodes}
				getValue={(node: EpisodeDTO) => node.rating}
				getGroup={(node: EpisodeDTO & { season: number}) => node.season.toString()}
				getTooltip={() => null}
				className='h-96 w-full fill-blue-200'>

			</Chart>
		</>
	)
}

const EpisodesTable = ({ratings}: { ratings: RatingsDTO }) => {
	const maxEpisodes = useMemo(
		() => Math.max(...ratings.seasons.map((season) => season.episodes.length)),
		[ratings]
	);
	const episodeNumbers = useMemo(() => Array.from({length: maxEpisodes}, (_, i) => i + 1), [maxEpisodes]);

	const normalizeRating = (rating: number) => {
		return Math.round(rating);
	}

	const columnClasses = 'flex flex-col gap-0.5';

	return (
		<>
			<h2 className="mb-2">Episode table</h2>
			<div className="flex flex-row gap-0.5 justify-center">
				<div className={columnClasses}>
					<Cell header={true} highest={true}></Cell>
					{
						episodeNumbers.map((episodeNumber) => (
							<Cell key={episodeNumber} header={true}>{episodeNumber}</Cell>
						))
					}
				</div>
				{
					ratings.seasons.map((season) => {
						return (
							<div key={season.season} className={columnClasses}>
								<Cell header={true}>{season.season}</Cell>
								{
									season.episodes.map((episode, index) => {
										return (
											<Tooltip key={index} content={<EpisodeDetails episode={episode}/>}>
												<Cell scale={normalizeRating(episode.rating)}>
													{Math.round(episode.rating * 10) / 10}
												</Cell>
											</Tooltip>
										);
									})
								}
							</div>
						);
					})
				}
			</div>
		</>
	);
};

const Cell = (props: { children?: ReactNode, header?: boolean, scale?: number, highest?: boolean }) => {
	let classNames = 'w-6 h-6 flex items-center justify-center text-xs hover:outline outline-primary outline-2 cursor-default';
	if (props.header) {
		classNames += ` font-bold bg-primary text-background sticky top-0 ${props.highest ? 'z-elevated-plus' : 'z-elevated'}`;
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
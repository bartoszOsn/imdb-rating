import { useEffect, useState } from 'react';
import { TrendingDTO, TrendingShowDTO } from '../../../shared/TrendingDTO.ts';
import { trendingRequest } from '../infrastructure/trendingRequest.ts';
import { Link } from 'react-router-dom';
import { imageTMDBBaseUrl } from '../imageTMDBBaseUrl.ts';
import { Tooltip } from '../util/components/tooltip';

export const HomeRoute = () => {
	const [trending, setTrending] = useState<TrendingDTO | null>(null);

	useEffect(() => {
		trendingRequest().then(setTrending);
	}, []);

	return (
		<>
			<h1 className='mb-2'>Tablesode</h1>
			<p>Welcome to Tablesode!</p>
			<p className='mb-4'>search for television show above or choose one of the trending ones.</p>
			<TrendingShows trending={trending} />
		</>
	)
}

const TrendingShows = ({ trending }: { trending: TrendingDTO | null }) => {
	if (!trending) {
		return null;
	}

	return (
		<>
			<h2>Today's trending</h2>
			<ul className='grid grid-cols-[repeat(auto-fill,_6rem)] gap-2'>
				{trending.results.map((show) => (
					<li key={show.id}>
						<Tooltip content={<TrengingShowDetails show={show} />}>
							<Link to={`/tv-show/${show.id}`}>
								<img className='w-24' src={`${imageTMDBBaseUrl}${show.posterPath}`} />
							</Link>
						</Tooltip>
					</li>
				))}
			</ul>
		</>
	)
}

const TrengingShowDetails = ({ show }: { show: TrendingShowDTO }) => {
	return (
		<div className='max-w-96'>
			<h3>{show.name}</h3>
			<p>{show.overview}</p>
		</div>
	)
}
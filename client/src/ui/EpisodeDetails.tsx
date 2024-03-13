import { EpisodeDTO } from '../../../shared/RatingsDTO.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';

export const EpisodeDetails = ({ episode }: { episode: EpisodeDTO }) => {
	return (
		<div className='max-w-96'>
			<h3 className='mb-2 text-medium'>{episode.name}</h3>
			<p className='mb-2 text-small'>{episode.overview}</p>
			<p className='text-textSubtle text-small'><FontAwesomeIcon icon={faStar} />: {episode.rating}, season {episode.season_number}, episode {episode.episode}</p>
		</div>
	)
}

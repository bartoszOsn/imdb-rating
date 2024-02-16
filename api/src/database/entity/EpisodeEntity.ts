import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { TvShowEntity } from './TvShowEntity';

@Entity('episode')
export class EpisodeEntity {
	@PrimaryColumn()
	id!: string;

	@ManyToOne(() => TvShowEntity, tvShow => tvShow.episodes)
	tvShow!: Promise<TvShowEntity>;

	@Column()
	season!: number;

	@Column()
	episode!: number;

	@Column()
	rating!: number;
}
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { EpisodeEntity } from './EpisodeEntity';

@Entity('tv_shows')
export class TvShowEntity {
	@PrimaryColumn()
	id!: string;

	@Column()
	title!: string;

	@Column()
	originalTitle!: string;

	@OneToMany(() => EpisodeEntity, episode => episode.tvShow)
	episodes!: Promise<Array<EpisodeEntity>>;
}
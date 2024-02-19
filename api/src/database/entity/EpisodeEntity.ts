import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('episode')
export class EpisodeEntity {
	@PrimaryColumn()
	id!: string;

	@Column()
	tvShowId!: string;

	@Column()
	season!: number;

	@Column()
	episode!: number;

	@Column()
	rating!: number;

	@Column()
	votes!: number;
}
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tv_shows')
export class TvShowEntity {
	@PrimaryColumn()
	id!: string;

	@Column()
	title!: string;

	@Column()
	originalTitle!: string;
}
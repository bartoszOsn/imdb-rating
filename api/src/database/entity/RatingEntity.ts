import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('rating')
export class RatingEntity {
	@PrimaryColumn()
	id!: string;

	@Column()
	averageRating!: number;

	@Column()
	numVotes!: number;
}
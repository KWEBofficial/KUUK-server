import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Restaurant from './restaurant.entity';

@Entity()
export default class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.location)
  restaurant!: Restaurant;

  @Column({
    name: 'location_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: '정후',
    comment: '식당 위치',
  })
  locationName!: string;
}

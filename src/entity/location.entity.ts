import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Location {
  @PrimaryGeneratedColumn()
  id!: number;

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

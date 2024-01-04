import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'restaurant_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '식당 이름'
  })
  restaurantName!: string;

  @Column({
    name: 'location',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '식당 장소'
  })
  location!: string;

  @Column({
    name: 'category',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '식당 카테고리'
  })
  category!: string;

  @Column({
    name: 'img_dir',
    nullable: true,
    comment: '이미지 디렉토리'
  })
  imgDir?: string;

  @Column({ name: 'description' })
  description!: string;
}

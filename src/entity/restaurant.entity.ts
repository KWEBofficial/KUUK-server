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
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '식당 이름'
  })
  restaurantName!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '식당 장소'
  })
  location!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '식당 카테고리'
  })
  category!: string;

  @Column({
    nullable: true,
    comment: '이미지 디렉토리'
  })
  img_dir?: string;

  @Column()
  description!: string;
}

import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from './category.entity'

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
    comment: '식당 위치'
  })
  location!: string;

  @ManyToMany(() => Category)
  @JoinTable({ name: 'category_ids' })
  categoryIds!: Category[];

  @Column({
    name: 'img_dir',
    nullable: true,
    comment: '이미지 디렉토리'
  })
  imgDir?: string; // 여긴 null 추가 시 Object로 인식되어 mysql로 처리 못함

  @Column({ name: 'description' })
  description!: string;
}

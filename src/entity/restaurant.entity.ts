import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from './category.entity';
import Location from './location.entity';
import Menu from './menu.entity';

@Entity()
export default class Restaurant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'restaurant_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '식당 이름',
  })
  restaurantName!: string;

  @ManyToOne(() => Location, (location) => location.id)
  location!: Location;

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus!: Menu[];

  @ManyToMany(() => Category)
  @JoinTable({ name: 'category_list' })
  categories!: Category[];

  @Column({
    name: 'img_dir',
    nullable: true,
    comment: '이미지 디렉토리',
  })
  imgDir?: string; // 여긴 null 추가 시 Object로 인식되어 mysql로 처리 못함

  @Column({ name: 'description' })
  description!: string;
}

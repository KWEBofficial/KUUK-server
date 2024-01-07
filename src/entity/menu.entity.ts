import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Restaurant from './restaurant.entity';

@Entity()
export default class Menu {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus)
  restaurant!: Restaurant;

  @Column({
    name: 'menu_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: '돈까스',
    comment: '메뉴 이름'
  })
  menuName!: string;

  @Column({
    name: 'price',
    type: 'int',
    nullable: false,
    default: 0,
    comment: '가격'
  })
  price!: number
}

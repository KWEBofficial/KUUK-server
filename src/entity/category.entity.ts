import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'category_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: '돈까스',
    comment: '카테고리 이름',
  })
  categoryName!: string;
}

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'user',
    comment: '사용자 이름',
  })
  userName!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'nickname',
    comment: '표시 이름',
  })
  displayName!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '비밀번호'
  })
  password!: string;

  @Column({ type: 'timestamp', nullable: true })
  birthDate?: Date;
}

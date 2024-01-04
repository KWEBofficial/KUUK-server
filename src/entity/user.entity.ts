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
    name: 'username',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'user',
    comment: '사용자 아이디',
  })
  username!: string;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'nickname',
    comment: '표시 이름',
  })
  displayName!: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: '비밀번호'
  })
  password!: string;

  @Column({
    name: 'birthdate',
    type: 'timestamp',
  })
  birthdate!: Date;
}

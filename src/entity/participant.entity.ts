import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';
import Poll from './poll.entity';

@Entity()
export default class Participant {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: true })
  user?: User | null;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: '아무개',
    comment: '참여자 이름'
  })
  displayName!: string;

  @ManyToOne(() => Poll, (poll) => poll.participants)
  poll!: Poll;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Candidate from './candidate.entity';
import Participant from './participant.entity';
import User from './user.entity';

@Entity()
export default class Poll {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'poll_name',
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'poll',
    comment: '투표 이름',
  })
  pollName!: string;

  @ManyToOne(() => User, (user) => user.id)
  createdUser!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt?: Date | null;

  @OneToMany(() => Candidate, (candidate) => candidate.poll)
  candidates!: Candidate[];

  @OneToMany(() => Participant, (participant) => participant.poll)
  participants!: Participant[];

  @Column({
    name: 'url',
    nullable: false,
    comment: '투표 URL',
  })
  url!: string;

  @Column({
    nullable: false,
    default: false,
  })
  isDeleted!: boolean;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
    comment: '투표 이름'
  })
  pollName!: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  createdBy!: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'ended_at', type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({
    name: 'url',
    nullable: false,
    comment: "투표 URL"
  })
  url!: string;
}

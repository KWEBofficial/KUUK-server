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
    type: 'varchar',
    length: 100,
    nullable: false,
    default: 'poll',
    comment: '투표 이름'
  })
  pollName!: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn()
  createdBy!: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({
    nullable: false,
    comment: "투표 URL"
  })
  url!: string;
}

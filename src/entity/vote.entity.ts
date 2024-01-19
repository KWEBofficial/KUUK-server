import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Candidate from './candidate.entity';
import Participant from './participant.entity';

@Entity()
export default class Vote {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Participant)
  votedUser!: Participant;

  @ManyToOne(() => Candidate)
  candidate!: Candidate;
}

import User from '../../entity/user.entity';

export default interface CreatePollInput {
  pollName: string;
  createdBy: User;
  url?: string;
  createdAt: Date;
  endedAt?: Date;
}
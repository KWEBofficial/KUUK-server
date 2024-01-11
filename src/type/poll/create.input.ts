import User from '../../entity/user.entity';

export default interface CreatePollInput {
  pollName: string;
  createdUser: Number;
  url?: string;
  createdAt: Date;
  endedAt?: Date;
}

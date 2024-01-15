import User from '../../entity/user.entity';

export default interface CreatePollInput {
  pollName: string;
  createdUser: User;
  url?: string;
  createdAt: Date;
  endedAt?: Date;
}

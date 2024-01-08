import User from '../../entity/user.entity';

export default interface CreatePollInput {
  pollName: string;
  createdUser: User; //Entity 명 바뀌면서 수정
  url?: string;
  createdAt: Date;
  endedAt?: Date;
}

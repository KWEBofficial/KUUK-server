import User from '../../entity/user.entity';
import Poll from '../../entity/poll.entity';

export default interface CreateParticipantInput {
  user?: User | null; //게스트=Null
  displayName: string;
  poll: Poll;
}

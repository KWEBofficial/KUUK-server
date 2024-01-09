import User from '../../entity/user.entity';
import Poll from '../../entity/poll.entity';

//헤민 연승 코드 참고
export default interface CreateParticipantInput {
  user?: User | null; //게스트의 경우는 Id가 없기 때문에 null 추가
  displayName: string;
  poll: Poll; //poll로 이름 수정
}

import Vote from '../entity/vote.entity';
import VoteRepository from '../repository/vote.repository';
import { InternalServerError } from '../util/customErrors';

export default class VoteService {
  static async getVotesByCandidateId(candidateId: number): Promise<Vote[]> {
    try {
      return await VoteRepository.find({
        where: { candidate: { id: candidateId } },
      });
    } catch (error) {
      throw new InternalServerError('득표 정보를 불러오는데 실패했습니다.');
    }
  }
}

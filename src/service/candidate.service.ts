import Candidate from '../entity/candidate.entity';
import CandidateRepository from '../repository/candidate.repository';
import { InternalServerError } from '../util/customErrors';

export default class CandidateService {
  static async getCandidatesByPollId(pollId: number): Promise<Candidate[]> {
    try {
      return await CandidateRepository.find({
        where: { poll: { id: pollId } },
        relations: ['poll', 'restaurant'], // 이거 넣어야 poll과 restaurant에 접근 가능
      });
    } catch (error) {
      throw new InternalServerError('후보 정보를 불러오는데 실패했습니다.');
    }
  }
}

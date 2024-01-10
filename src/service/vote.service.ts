import Vote from '../entity/vote.entity';
import VoteRepository from '../repository/vote.repository';
import { InternalServerError } from '../util/customErrors';
import Candidate from '../entity/candidate.entity';
import CreateVoteInput from '../type/vote/create.input';

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

  static async getVotesByCandidate(candidate: Candidate): Promise<Vote[]> {
    try {
      const candidateId = candidate.id;
      const votes = await VoteRepository.find({
        where: { candidate: { id: candidateId } },
        relations: ['votedUser', 'candidate'],
      });
      return votes;
    } catch (error) {
      throw new InternalServerError('투표 정보를 불러오는데 실패했습니다.');
    }
  }

  static async getVotesListByCandidates(candidates: Candidate[]): Promise<Vote[][]> {
    try {
      const votesPromises = candidates.map(async (candidate) => {
        const vote = await this.getVotesByCandidate(candidate);
        return vote;
      });
      return Promise.all(votesPromises);
    } catch (error) {
      throw new InternalServerError('투표 정보를 불러오는데 실패했습니다.');
    }
  }

  //vote 저장용 service
  static async saveVote(
    //vote table에 저장
    createVoteInput: CreateVoteInput,
  ): Promise<Vote> {
    try {
      const participantEntity = await VoteRepository.create(createVoteInput);
      return await VoteRepository.save(participantEntity);
    } catch (error) {
      throw new InternalServerError('게스트 정보를 저장하는데 실패했습니다.');
    }
  }
}

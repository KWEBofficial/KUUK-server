import Poll from '../entity/poll.entity';
import CreatePollInput from '../type/poll/create.input';
import PollRepository from '../repository/poll.repository';
import { InternalServerError } from '../util/customErrors';

export default class PollService {
  static async getPollById(id: number): Promise<Poll | null> {
    try {
      return await PollRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerError('투표 정보를 불러오는데 실패했습니다.');
    }
  }

  static async getPollsByPollName(pollName: string): Promise<Poll[]> {
    try {
      return await PollRepository.find({ where: { pollName } });
    } catch (error) {
      throw new InternalServerError('투표 정보를 불러오는데 실패했습니다.');
    }
  }

  static async createPoll(createPollInput: CreatePollInput): Promise<Poll> {
    try {
      const userEntity = await PollRepository.create(createPollInput);
      return await PollRepository.save(userEntity);
    } catch (error) {
      throw new InternalServerError('투표 정보를 저장하는데 실패했습니다.');
    }
  }

  //url로 poll 구분 -> 뭔가 에러 안나게끔 했는데 findOne 쓰고 싶음
  static async getPollByUrl(url: string): Promise<Poll> {
    try {
      return await PollRepository.findOneOrFail({ where: { url } });
    } catch (error) {
      throw new InternalServerError('투표 정보를 불러오는데 실패했습니다.');
    }
  }
}

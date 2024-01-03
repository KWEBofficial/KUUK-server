import Poll from '../entity/poll.entity';
import CreatePollInput from '../type/poll/create.input';
import { PollRepository } from '../repository/db.repository';
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
}

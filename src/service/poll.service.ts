import Poll from '../entity/poll.entity';
import CreatePollInput from '../type/poll/create.input';
import PollRepository from '../repository/poll.repository';
import { InternalServerError } from '../util/customErrors';

export default class PollService {
  static async getPollById(id: number): Promise<Poll | null> {
    try {
      return await PollRepository.findOne({
        where: { id },
        relations: ['createdUser'],
      });
    } catch (error) {
      throw new InternalServerError(
        '아이디로 투표 정보를 불러오는데 실패했습니다.',
      );
    }
  }

  static async createPoll(createPollInput: CreatePollInput): Promise<Poll> {
    try {
      const pollEntity = await PollRepository.create(createPollInput);
      return await PollRepository.save(pollEntity);
    } catch (error) {
      throw new InternalServerError('투표 정보를 저장하는데 실패했습니다.');
    }
  }

  static async getPollByUrl(url: string): Promise<Poll> {
    try {
      return await PollRepository.findOneOrFail({ where: { url } });
    } catch (error) {
      throw new InternalServerError(
        'URL로 투표 정보를 불러오는데 실패했습니다.',
      );
    }
  }

  static async getPollsByUserId(userId: number): Promise<Poll[]> {
    try {
      return await PollRepository.find({
        where: { createdUser: { id: userId } }, relations: ['candidates', 'candidates.restaurant']
      });
    } catch (error) {
      throw new InternalServerError(
        '사용자 아이디로 투표 정보를 불러오는데 실패했습니다.',
      );
    }
  }

  static generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }
}

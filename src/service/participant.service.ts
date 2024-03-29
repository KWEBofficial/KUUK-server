import Participant from '../entity/participant.entity';
import ParticipantRepository from '../repository/participant.repository';
import CreateParticipantInput from '../type/participant/create.input';
import { InternalServerError } from '../util/customErrors';

export default class ParticipantService {
  static async getParticipantByDisplayNameandPollId(
    poll_id: number,
    displayName: string,
  ): Promise<Participant | null> {
    try {
      return await ParticipantRepository.findOne({
        where: { poll: { id: poll_id }, displayName },
      });
    } catch (error) {
      throw new InternalServerError('참가자 정보를 찾을 수 없습니다.');
    }
  }

  static async saveParticipant(
    createParticipantInput: CreateParticipantInput,
  ): Promise<Participant> {
    try {
      const participantEntity = await ParticipantRepository.create(
        createParticipantInput,
      );
      return await ParticipantRepository.save(participantEntity);
    } catch (error) {
      throw new InternalServerError('참가자 정보를 저장하는데 실패했습니다.');
    }
  }
}

import AppDataSource from '../config/dataSource';
import Participant from '../entity/participant.entity';

const ParticipantRepository = AppDataSource.getRepository(Participant).extend({});

export default ParticipantRepository;
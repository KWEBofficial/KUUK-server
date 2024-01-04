import AppDataSource from '../config/dataSource';
import Candidate from '../entity/candidate.entity';

const CandidateRepository = AppDataSource.getRepository(Candidate).extend({});

export default CandidateRepository;
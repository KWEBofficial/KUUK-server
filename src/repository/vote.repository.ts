import AppDataSource from '../config/dataSource';
import Vote from '../entity/vote.entity';

const VoteRepository = AppDataSource.getRepository(Vote).extend({});

export default VoteRepository;

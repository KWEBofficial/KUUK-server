import AppDataSource from '../config/dataSource';
import Poll from '../entity/poll.entity';

const PollRepository = AppDataSource.getRepository(Poll).extend({});

export default PollRepository;

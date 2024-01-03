import AppDataSource from '../config/dataSource';
import Candidate from '../entity/candidate.entity';
import Menu from '../entity/menu.entity';
import Participant from '../entity/participant.entity';
import Poll from '../entity/poll.entity';
import Restaurant from '../entity/restaurant.entity';
import User from '../entity/user.entity';
import Vote from '../entity/vote.entity';

const CandidateRepository = AppDataSource.getRepository(Candidate).extend({});
const MenuRepository = AppDataSource.getRepository(Menu).extend({});
const ParticipantRepository = AppDataSource.getRepository(Participant).extend({});
const PollRepository = AppDataSource.getRepository(Poll).extend({});
const RestaurantRepository = AppDataSource.getRepository(Restaurant).extend({});
const UserRepository = AppDataSource.getRepository(User).extend({});
const VoteRepository = AppDataSource.getRepository(Vote).extend({});

export {
  CandidateRepository,
  MenuRepository,
  ParticipantRepository,
  UserRepository,
  PollRepository,
  RestaurantRepository,
  VoteRepository
};

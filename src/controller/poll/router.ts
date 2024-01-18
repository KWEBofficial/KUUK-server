import { Router } from 'express';
import {
  getSettingform,
  createFilteredRestaurants,
  creatPollAndCandidate,
  getPollResultById,
  getPollForm,
  getPollsByUserId,
  getVoteCount,
  postVoteInPoll,
  endPoll,
  deletePollsByPollIds,
} from './controller';

const pollRouter = Router();

pollRouter.get('/', getSettingform);
pollRouter.get('/restaurant', createFilteredRestaurants);
pollRouter.post('/restaurant', creatPollAndCandidate);

pollRouter.get('/:pollId(\\d+)', getPollForm);
pollRouter.get('/:pollId(\\d+)/:candidateId(\\d+)', getVoteCount);
pollRouter.post('/:pollId(\\d+)', postVoteInPoll);
pollRouter.post('/end/:pollId(\\d+)', endPoll);

pollRouter.get('/result/:pollId(\\d+)', getPollResultById);
pollRouter.get('/history', getPollsByUserId);

pollRouter.post('/delHistory', deletePollsByPollIds);

export default pollRouter;

import { Router } from 'express';
import {
  getSettingform,
  createFilteredRestaurants,
  creatPollAndCandidate,
  getPollResultById,
  getPollForm,
  getPollsByUserId,
  postVoteInPoll,
  endPoll,
} from './controller';

const pollRouter = Router();

pollRouter.get('/', getSettingform);
pollRouter.get('/restaurant', createFilteredRestaurants);
pollRouter.post('/restaurant', creatPollAndCandidate);
pollRouter.get('/result/:pollId(\\d+)', getPollResultById);
pollRouter.get('/:pollId(\\d+)', getPollForm);
pollRouter.post('/:pollId(\\d+)', postVoteInPoll);
pollRouter.post('/end/:pollId(\\d+)', endPoll);
pollRouter.get('/history', getPollsByUserId);

export default pollRouter;

import { Router } from 'express';
import {
  getSettingform,
  createFilteredRestaurants,
  creatPollAndCandidate,
  getPollResultById,
  getPollForm,
  getPollsByUserId,
} from './controller';

const pollRouter = Router();

pollRouter.get('/', getSettingform);
pollRouter.get('/restaurant', createFilteredRestaurants);
pollRouter.post('/restaurant', creatPollAndCandidate);
pollRouter.get('/result/:pollId(\\d+)', getPollResultById);
pollRouter.get('/:pollId(\\d+)', getPollForm);
pollRouter.get('/history', getPollsByUserId);

export default pollRouter;

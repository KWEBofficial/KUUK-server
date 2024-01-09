import { Router } from 'express';
import {
  getSettingform,
  createFilteredRestaurants,
  creatPollAndCandidate,
  getPollResultById,
} from './controller';

const pollRouter = Router();

pollRouter.get('/', getSettingform);
pollRouter.get('/restaurant', createFilteredRestaurants);
pollRouter.post('/restaurant', creatPollAndCandidate);
pollRouter.get('/result/:pollId', getPollResultById);

export default pollRouter;

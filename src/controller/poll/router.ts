import { Router } from 'express';
import {
  getSettingform,
  createFilteredRestaurants,
  creatPollAndCandidate,
  getPollResultById,
  getPollForm,
} from './controller';

const pollRouter = Router();

pollRouter.get('/', getSettingform);
pollRouter.get('/restaurant', createFilteredRestaurants);
pollRouter.post('/restaurant', creatPollAndCandidate);
pollRouter.get('/result/:pollId', getPollResultById);
pollRouter.get('/:pollId', getPollForm);

export default pollRouter;

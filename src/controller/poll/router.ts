import { Router } from 'express';
import {
  getSettingform,
  createFilteredRestaurants,
  creatPollAndCandidate,
} from './controller';

const pollRouter = Router();

// pollRouter.get('/', getPollById);

// 두 라우터를 구분해야 함
pollRouter.get('/', getSettingform);
pollRouter.get('/restaurant', createFilteredRestaurants);
pollRouter.post('/restaurant', creatPollAndCandidate);

export default pollRouter;

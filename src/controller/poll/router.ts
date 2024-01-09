import { Router } from 'express';
import {
  getPollById,
  getPollsByPollName,
  createPoll,
  getPollResultById,
} from './controller';

const pollRouter = Router();

pollRouter.get('/', getPollById);
pollRouter.get('/', getPollsByPollName);
pollRouter.get('/', createPoll);
pollRouter.get('/result/:pollId', getPollResultById);

export default pollRouter;

import { Router } from 'express';
import { getPollById, getPollsByPollName, createPoll} from './controller';

const pollRouter = Router();

pollRouter.get('/', getPollById);
pollRouter.get('/', getPollsByPollName);
pollRouter.get('/', createPoll);

export default pollRouter;

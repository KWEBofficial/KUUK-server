import { Router } from 'express';
import guestRouter from './participant/router';
import pollRouter from './poll/router';
import userRouter from './user/router';

const router = Router();

router.use('/user', userRouter);
router.use('/poll', pollRouter);
router.use('/guest', guestRouter);

export default router;

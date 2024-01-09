import { Router } from 'express';
import userRouter from './user/router';
import pollRouter from './poll/router';
import guestRouter from './participant/router';

const router = Router();

router.use('/user', userRouter);
router.use('/poll', pollRouter);
router.use('/guest', guestRouter);

export default router;

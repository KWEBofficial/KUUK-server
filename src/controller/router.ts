import { Router } from 'express';
import userRouter from './user/router';
import pollRouter from './poll/router'

const router = Router();

router.use('/user', userRouter);
router.use('/poll', pollRouter);

export default router;

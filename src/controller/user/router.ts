import { Router } from 'express';
import {
  createUser,
  getStatus,
  loginUser,
  logoutUser,
} from './controller';

const userRouter = Router();

userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/join', createUser);
userRouter.get('/status', getStatus);

export default userRouter;

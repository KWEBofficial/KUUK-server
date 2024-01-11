import { Router } from 'express';
import { createUser, loginUser, logoutUser } from './controller';

const userRouter = Router();

userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/join', createUser);

export default userRouter;

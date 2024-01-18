import { Router } from 'express';
import { loginGuest, showGuestLoginPage, getStatus } from './controller';

const guestRouter = Router();

guestRouter.get('/login/:url', showGuestLoginPage);
guestRouter.post('/login', loginGuest);
guestRouter.get('/status', getStatus);

export default guestRouter;

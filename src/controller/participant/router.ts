import { Router } from 'express';
import { loginGuest, showGuestLoginPage } from './controller';

const guestRouter = Router();

guestRouter.get('/login/:url', showGuestLoginPage);
guestRouter.post('/login', loginGuest);

export default guestRouter;

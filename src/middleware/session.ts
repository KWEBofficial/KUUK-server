import session from 'express-session';

const SESSION_SECRET = String(process.env.SESSION_SECRET);

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
    guest: { [key: string]: any };
  }
}

const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
});

export default sessionMiddleware;

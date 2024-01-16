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
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24, //세션 기한 24시간
  },
});

export default sessionMiddleware;

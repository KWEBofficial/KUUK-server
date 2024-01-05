import cors from 'cors';
import express from 'express';
import session from 'express-session';
import 'reflect-metadata';
import AppDataSource from './config/dataSource';
import './config/env';
import router from './controller/router';
import errorHandler from './util/errorHandler';

const PORT = Number(process.env.PORT) || 3000;

const SESSION_SECRET = String(process.env.SESSION_SECRET);

const app = express();

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

// 세션 미들웨어 설정 (gpt 행님)
app.use(session({
  secret: SESSION_SECRET, // 세션 암호화에 사용되는 비밀키
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // HTTPS가 아닌 환경에서도 사용 가능하도록 설정
}));

AppDataSource.initialize().then(() => console.log('DATABASE is connected!'));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: false })); // cookie를 전달하고 싶을 때는 credential을 true로 해줘야 함
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is started!`));

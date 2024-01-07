import { RequestHandler } from 'express';
import UserService from '../../service/user.service';
import CreateUserInput from '../../type/user/create.input';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import {
  generatePassword,
  verifyPassword,
} from '../../security/passwordHashing'; //왜 이것만 세로 배열인지 아시는 분...?

// POST /user/login
export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    // body에서 username, password 받아오기
    const { username, password } = req.body;
    // 누락되었다면 BadRequestError (?)
    if (!username || !password)
      throw new BadRequestError('아이디와 비밀번호를 모두 입력해주세요');
    // username에 해당하는 user 정보 가져오기
    const user = await UserService.getUsersByUsername(username);
    // 없다면 UnauthorizedError (?)
    if (!user) throw new UnauthorizedError('해당하는 유저가 없습니다.');
    // 해싱 이용 비밀번호 확인
    const isValid = await verifyPassword(password, user[0].password);
    if (!isValid) throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');
    // 모두 통과했다면 user 정보를 session에 저장!
    req.session.user = {
      id: user[0].id,
      username: user[0].username,
      displayName: user[0].displayName,
    }; // 정보 더 추가해야 하는가?
    // 메인 페이지로 redirection 추가 필요
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// POST /user/join
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { username, displayName, password, birthdate } =
      req.body as CreateUserInput;
    const createUserInput: CreateUserInput = {
      username,
      displayName,
      password,
      birthdate,
    };
    // 중복 검사 (?)
    const existingUser = await UserService.getUsersByUsername(username);
    if (existingUser) throw new BadRequestError('이미 존재하는 아이디입니다.');
    // 유저 정보 저장 (password 암호화 해줄 것인지?)
    const user = await UserService.saveUser(createUserInput);
    // 로그인 페이지로 redirection 추가 필요
    res.status(201).json(user.id);
  } catch (error) {
    next(error);
  }
};

// POST /user/logout
export const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    // session destroy 해주기
    req.session.destroy((err) => {
      if (err) throw err;
      else return; // 메인페이지로 redirect 추가 필요
    });
  } catch (error) {
    next(error);
  }
};

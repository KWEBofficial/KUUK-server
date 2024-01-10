import { RequestHandler } from 'express';
import UserService from '../../service/user.service';
import CreateUserInput from '../../type/user/create.input';
import { BadRequestError, UnauthorizedError } from '../../util/customErrors';
import {
  generatePassword,
  verifyPassword,
} from '../../security/passwordHashing';

// POST /user/login
export const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      throw new BadRequestError('아이디와 비밀번호를 모두 입력해주세요');

    const user = await UserService.getUserByUsername(username);
    if (!user) throw new UnauthorizedError('해당하는 유저가 없습니다.');

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');

    req.session.user = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
    };

    // 메인 페이지로 redirection
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// POST /user/join
export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { username, displayName, password, confirmPassword, birthdate } =
      req.body as CreateUserInput & { confirmPassword: string };

    //아이디 16자 이하, 비밀번호 일치, 닉네임 길이 32자 이하, 아이디 중복 방지
    if (!username || username.length > 16)
      throw new BadRequestError('아이디가 적절하지 않습니다.');
    if (!password) throw new BadRequestError('비밀번호가 비어 있습니다.');
    if (password !== confirmPassword)
      throw new BadRequestError('비밀번호가 서로 일치 하지 않습니다.');
    if (!displayName || displayName.length > 32)
      throw new BadRequestError('닉네임이 적절하지 않습니다.');

    const existingUser = await UserService.getUserByUsername(username);
    if (existingUser) throw new BadRequestError('이미 존재하는 아이디입니다.');

    //비밀번호 해싱
    const hashedPassword = await generatePassword(password);

    const createUserInput: CreateUserInput = {
      username,
      displayName,
      password: hashedPassword,
      birthdate,
    };
    const user = await UserService.saveUser(createUserInput);

    // 로그인 페이지로 redirection 추가 필요
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

// POST /user/logout
export const logoutUser: RequestHandler = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) throw err;
      else {
        res.status(200).json({ message: 'Logout Success' });
      }
    });
  } catch (error) {
    next(error);
  }
};

import { RequestHandler } from 'express';
import UserService from '../../service/user.service';
import CreateUserInput from '../../type/user/create.input';
import { BadRequestError } from '../../util/customErrors';

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.query.id);

    const user = await UserService.getUserById(id);
    if (!user) throw new BadRequestError('해당하는 유저가 없습니다.');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Params 이용 예시
// export const getUsersByAge: RequestHandler = async (req, res, next) => {
//   try {
//     const age = Number(req.params.age);

//     const users = await UserService.getUsersByAge(age);

//     res.json(users);
//   } catch (error) {
//     next(error);
//   }
// };

export const getUsersByUsername: RequestHandler = async (req, res, next) => {
  try {
    const username = Number(req.query.username);

    const users = await UserService.getUserById(username);
    // 리스트 검사 필요?

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUsersByBirthdate: RequestHandler = async (req, res, next) => {
  try {
    const birthdate = new Date(Date.parse(String(req.query.birthdate))); // 임시 parsing
    if (!birthdate) throw new BadRequestError('유효하지 않은 생년월일입니다.');

    const users = await UserService.getUsersByBirthdate(birthdate);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { username, displayName, password, birthdate } = req.body as CreateUserInput;
    const createUserInput: CreateUserInput = { username, displayName, password, birthdate };

    const user = await UserService.saveUser(createUserInput);

    res.status(201).json(user.id);
  } catch (error) {
    next(error);
  }
};

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

export const getUsersByUserName: RequestHandler = async (req, res, next) => {
  try {
    const userName = Number(req.query.userName);

    const users = await UserService.getUserById(userName);
    // 리스트 검사 필요?

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUsersByBirthDate: RequestHandler = async (req, res, next) => {
  try {
    const birthDate = Number(req.query.birthDate); // Date 형식??

    const users = await UserService.getUserById(birthDate);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { userName, displayName, password, birthDate } = req.body as CreateUserInput;
    const createUserInput: CreateUserInput = { userName, displayName, password, birthDate };

    const user = await UserService.saveUser(createUserInput);

    res.status(201).json(user.id);
  } catch (error) {
    next(error);
  }
};

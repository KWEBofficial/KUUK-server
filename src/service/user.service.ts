import User from '../entity/user.entity';
import CreateUserInput from '../type/user/create.input';
import { UserRepository } from '../repository/db.repository';
import { InternalServerError } from '../util/customErrors';

export default class UserService {
  static async getUserById(id: number): Promise<User | null> {
    try {
      return await UserRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오는데 실패했습니다.');
    }
  }

  static async getUsersByUsername(username: string): Promise<User[]> {
    try {
      return await UserRepository.find({ where: { username } });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오는데 실패했습니다.');
    }
  }

  static async getUsersByBirthdate(birthdate: Date): Promise<User[]> {
    try {
      return await UserRepository.find({ where: { birthdate } });
    } catch (error) {
      throw new InternalServerError('유저 정보를 불러오는데 실패했습니다.');
    }
  }

  static async saveUser(createUserInput: CreateUserInput): Promise<User> {
    try {
      const userEntity = await UserRepository.create(createUserInput);
      return await UserRepository.save(userEntity);
    } catch (error) {
      throw new InternalServerError('유저 정보를 저장하는데 실패했습니다.');
    }
  }
}

import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return await this.repository.findOneOrFail({
      relations: ['games'],
      where: {
        id: user_id
      }
    });
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(`SELECT * FROM USERS ORDER BY FIRST_NAME ASC`); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(`SELECT U.FIRST_NAME, U.LAST_NAME, U.EMAIL FROM USERS U WHERE LOWER(U.FIRST_NAME) = LOWER('${first_name}') AND LOWER(U.LAST_NAME) = LOWER('${last_name}')`);
  }
}

import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder('games')
      .select('title')
      .where(`title ~* :title`, { title: param })
      .getRawMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(`SELECT COUNT(*) FROM GAMES`); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder('games')
      .select('u.first_name, u.last_name, u.email')
      .innerJoin('users_games_games', 'ugg', 'games.id = ugg.gamesId')
      .innerJoin('users', 'u', 'ugg.usersId = u.id')
      .where('ugg.gamesId = :id', { id })
      .getRawMany();
  }
}

import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-user.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Inject data source
     */
    private readonly dataSource: DataSource,
  ) {}
  /**
   * Insert many users
   */
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];

    // create a Query Runner instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // connect this instance to our datasource
      await queryRunner.connect();

      //start the transaction
      await queryRunner.startTransaction();
    } catch (error) {
      console.log('Error', error);
      throw new RequestTimeoutException('Could not connect to the database');
    }

    //CRUD OPS
    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      // If successful. commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // If unsuccessful, rollback
      await queryRunner.rollbackTransaction();

      throw new ConflictException('Could not complete ethe transaction', {
        description: String(error),
      });
    } finally {
      try {
        // release connection
        await queryRunner.release();
      } catch (error) {
        // eslint-disable-next-line no-unsafe-finally
        throw new RequestTimeoutException('Could not release the connnection', {
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}

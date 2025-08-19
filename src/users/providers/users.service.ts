import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable /*, forwardRef, Inject*/,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
// import { AuthService } from 'src/auth/providers/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigService } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

/**
 * Controller class for '/users' API endpoint
 */
@Injectable()
export class UsersService {
  // constructor(
  //   @Inject(forwardRef(() => AuthService))
  //   private readonly authService: AuthService,
  // ) {}

  constructor(
    /**
     * Injecting User repository into UsersService
     * */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configServe: ConfigService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Inject usersCreatemanyProvider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    /**
     * Inject create user provider
     */
    private readonly createUserprovider: CreateUserProvider,

    /*
     Inject findoneUserByEmail Provider
    */
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserprovider.createUser(createUserDto);
  }

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    // const isAuth = this.authService.isAuth();
    // console.log('isAuth', isAuth);

    /* console.log('ENV', this.configServe.get<string>('S3_BUCKET'));

    console.log('MODULE SPECIFIC CONFIG', this.profileConfiguration.apiKey);

    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];*/

    /**
     * Custom Exception Handling
     */
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured becaue the API endpoint was permanently moved',
      },
    );
  }

  /*
    Find a user by Id
  */
  public async findOneById(id: number) {
    let user: User | null = null;

    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      console.log('Error', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: 'Error conecting to the database',
        },
      );
    }

    /**
     * User does not exist exception
     */
    if (!user) {
      throw new BadRequestException('The user id does not exist.');
    }

    return user;
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}

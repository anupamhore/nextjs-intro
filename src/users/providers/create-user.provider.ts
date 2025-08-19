import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject user repository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    /**
     * Inject Hasging provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    /**
     * inject mailService
     */
    private readonly mailService: MailService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      // Check if user with email exists
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      console.log('Error', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    /**
     * Handle exceptions if user exists later
     * */
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists. Please check your email.',
      );
    }

    // Try to create a new user
    // - Handle Exceptions Later

    //create a new user
    let hashPassword: string | null = null;
    hashPassword = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );

    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashPassword,
    });
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      console.log('Error', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    //Send the email
    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
    // Create the user
    return newUser;
  }
}

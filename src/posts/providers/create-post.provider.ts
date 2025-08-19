import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    /**
     * inject user service
     */
    private readonly usersService: UsersService,

    /**
     * Inject post repository
     */
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    /**
     * Inject tags service
     */
    private readonly tagsService: TagsService,
  ) {}
  /**
   *
   * @param createPostDto
   */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author: User | null = null;
    let tags: Tag[] | null = null;
    try {
      // Find author from database based on authorId
      author = await this.usersService.findOneById(user.sub);

      tags = await this.tagsService.findMultipleTags(createPostDto.tags!);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new BadRequestException('Please check your tag ids');
    }

    /*
     * IN CASCADE SITUATION
     */

    //Create post
    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      //return the post
      return await this.postRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }

    /* In NOT CASCADE SITUATION
        //Create metaOptions
        let metaOptions: MetaOption | undefined;
    
        if (createPostDto.metaOptions) {
          metaOptions = this.metaOptionsRepository.create(
            createPostDto.metaOptions,
          );
          await this.metaOptionsRepository.save(metaOptions);
        }
    
        //Create post & add metaOptions to the post
        const post = this.postRepository.create({
          ...createPostDto,
          metaOptions, // undefined if not provided
        });
    
        //return the post
        return await this.postRepository.save(post);
        */
  }
}

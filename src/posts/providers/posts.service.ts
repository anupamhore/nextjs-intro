import {
  Injectable,
  Body,
  RequestTimeoutException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
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
     * Inject Meta Option
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,

    /**
     * Inject tags service
     */
    private readonly tagsService: TagsService,

    /**
     * Inject create post provider
     */
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  /**
   *
   * @param createPostDto
   */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
  }

  /**
   *
   * @param userId
   * @returns
   */
  public async findAll(userId: string) {
    return await this.postRepository.find({});

    /*
     When we dont use "eager": true in the entity then we use the following
     This will also bring the metaOptions table data into the query

     return await this.postRepository.find({
       relations:{
         metaOptions: true // this is the column name ,
         author: true,
         tags: true
       }
     });

    */
  }

  /*
   * Delete post
   */
  public async delete(id: number) {
    /*
    //find the post for that id
    const post = await this.postRepository.findOneBy({ id });

 
     * WHEN WE NOT USE BI-DIRECTIONAL ONE-TO-ONE RELATION
    //delete the post
    await this.postRepository.delete(id);

    //delete the meta options
    if (post?.metaOptions)
      await this.metaOptionsRepository.delete(post?.metaOptions?.id);
   */

    await this.postRepository.delete(id);
    //confirmation
    return { deleted: true, id };
  }

  /**
   * Update Posts
   */
  public async update(patchPostDto: PatchPostDto) {
    let tags: Tag[] | null = null;
    let post: Post | null = null;

    //Find the tags
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags!);
    } catch (error) {
      console.log('Error', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later',
      );
    }

    /**
     * Number of tags need to be equal
     */
    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag ids and ensure they are correct',
      );
    }

    //Find the post
    try {
      post = await this.postRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      console.log('Error', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later',
      );
    }

    if (!post) {
      throw new BadRequestException('The post ID does not exist');
    }

    //Update the properties of the post
    if (post) {
      post.title = patchPostDto.title ?? post.title;
      post.content = patchPostDto.content ?? post.content;
      post.status = patchPostDto.status ?? post.status;
      post.postType = patchPostDto.postType ?? post.postType;
      post.slug = patchPostDto.slug ?? post.slug;
      post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishOn = patchPostDto.publishOn ?? post.publishOn;

      //Assign the new tags
      post.tags = tags;
    }

    //Save the post and return
    try {
      await this.postRepository.save(post);
    } catch (error) {
      console.log('Error', error);
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later',
      );
    }
    return post;
  }
}

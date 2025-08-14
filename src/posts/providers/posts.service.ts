import { Injectable, Body } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

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
  ) {}

  /**
   *
   * @param createPostDto
   */
  public async create(@Body() createPostDto: CreatePostDto) {
    // Find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);

    const tags = await this.tagsService.findMultipleTags(createPostDto.tags!);
    /*
     * IN CASCADE SITUATION
     */

    //Create post
    const post = this.postRepository.create({
      ...createPostDto,
      author: author!,
      tags: tags,
    });

    //return the post
    return await this.postRepository.save(post);

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
    //Find the tags
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags!);

    //Find the post
    const post = await this.postRepository.findOneBy({
      id: patchPostDto.id,
    });

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
    return await this.postRepository.save(post!);
  }
}

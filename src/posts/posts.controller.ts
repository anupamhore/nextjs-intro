import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  /**
   * GET localhost:3000/posts/:userId
   * '{/:userId}' optional
   */
  @Get('{/:userId}')
  public getPosts(@Param('userId') userId: string) {
    return this.postService.findAll(userId);
  }
}

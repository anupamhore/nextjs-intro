import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

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

  @ApiOperation({
    summary: 'Creates a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  @Post()
  public createPost(@Body() createpostDto: CreatePostDto) {
    return this.postService.create(createpostDto);
  }

  /**
   * Route to delete a post
   */
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postService.delete(id);
  }

  @ApiOperation({
    summary: 'Updates an existing blog post',
  })
  @ApiResponse({
    status: 200,
    description: 'A 200 response if the post is updated successfully',
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postService.update(patchPostDto);
  }
}

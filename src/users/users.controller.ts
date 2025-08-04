import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  //Req,
  // Headers,
  // Ip,
  ParseIntPipe,
  DefaultValuePipe,
  // ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
// import type { Request } from 'express';

@Controller('users')
export class UsersController {
  /**
   * Final Endpoint - /users/id?limit=10&page=1
   * Param id - optional, convert to integer, cannot have a default value
   * Query limit - integer, default 10
   * Query page - integer, default 1
   * ===> USE CASES
   * /users/ -> return all users with default pagination
   * /users/1223 -> returns one user whose id is 1223
   * /users?limit=10&page=2 -> returns page 2 with limit of pagination 10
   */

  //@Get('/:id') // This is mandatory query param
  //@Get('/{:id}') // This is when query param is optional
  //@Get('{/:id}{/:optional}') // This is when both fields are optional
  @Get('{/:id}')
  public getUsers(
    //@Param('id', ParseIntPipe) id: number | undefined,
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    // console.log('Params:', id);
    // console.log('Type of id:', typeof id);
    // console.log('Limit:', limit);
    // console.log('Type of Limit:', typeof limit);
    // console.log('Page:', page);
    // console.log('Type of Page:', typeof page);

    console.log('getUserParamDto:', getUserParamDto);
    return 'You send a get request to users endpoints';
  }

  @Post()
  public createUsers(
    @Body() createUserDto: CreateUserDto,
    // @Headers() headers: any,
    // @Ip() ip: string,
  ) {
    //public createUsers(@Req() request: Request) {
    console.log('Request Body:', createUserDto);
    // console.log('Headers:', headers);
    // console.log('IP Address:', ip);
    return 'You sent a post request to users endpoints';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    // console.log('Patch User Data:', patchUserDto);
    return patchUserDto;
  }

  @Put()
  public replaceUser() {
    return 'You sent a put request to users endpoints';
  }

  @Delete()
  public deleteUser() {
    return 'You sent a delete request to users endpoints';
  }
}

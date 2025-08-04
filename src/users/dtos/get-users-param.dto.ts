import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersParamDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number) //this will transform any type passed in the request to an integer
  id?: number;
}

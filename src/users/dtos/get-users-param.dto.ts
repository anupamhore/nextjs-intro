import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'Get user with a specific ID',
    type: Number,
    example: 123,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number) //this will transform any type passed in the request to an integer
  id?: number;
}

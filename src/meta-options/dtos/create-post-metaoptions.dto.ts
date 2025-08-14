// import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @ApiProperty({
    description: 'The metaValue is a JSON string',
    type: 'string',
    example: '{"sidebarEnabled": true}',
  })
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}

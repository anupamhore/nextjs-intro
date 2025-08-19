import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsJSON,
  IsUrl,
  IsISO8601,
  IsArray,
  ValidateNested,
  MaxLength,
  // IsInt,
  IsNumber,
} from 'class-validator';
import { postStatus } from '../enums/postStatus.enum';
import { postType } from '../enums/postType.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-metaoptions.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'My First Post',
    minLength: 4,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Type of the post (e.g., post, page, story, series)',
    enum: postType,
    example: postType.POST,
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: 'Unique slug for the post, used in the URL',
    example: 'my-first-post',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    description: 'Status of the post (e.g., draft, published, archived)',
    enum: postStatus,
    example: postStatus.DRAFT,
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'Content of the post in Markdown format',
    example: '# My First Post\nThis is the content of my first post.',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Schema for the post, in JSON format',
    example: '{"key": "value"}',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image URL for the post',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Date and time when the post should be published',
    example: '2023-10-01T12:00:00Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Tags Ids associated with the post',
    example: [1, 2],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tags?: number[];

  @ApiPropertyOptional({
    description: 'Meta options for the post',
    type: CreatePostMetaOptionsDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto) //type converion from the request to the DTO
  metaOptions?: CreatePostMetaOptionsDto;

  // @ApiProperty({
  //   type: 'integer',
  //   required: true,
  //   example: 1,
  // })
  // @IsNotEmpty()
  // @IsInt()
  // authorId: number;
}

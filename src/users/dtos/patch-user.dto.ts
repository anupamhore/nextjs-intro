import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * With this Partial Type of mapped-types,
 * we make all fields of CreateuserDto as optional
 * we extended the CreateUserDto class and included in this class
 * Do Not Repeat design DRY
 */
export class PatchUserDto extends PartialType(CreateUserDto) {}

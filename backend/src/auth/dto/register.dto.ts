import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// export enum Role {
//   USER = 'USER',
//   ADMIN = 'ADMIN',
// }

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Invalid mobile number format',
  })
  mobileNumber!: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long', })
  @MaxLength(20, { message: 'Password must be at most 20 characters long', })
  password: string;

  // @IsEnum(Role)
  // @IsNotEmpty()
  // role?: Role = Role.USER;

}
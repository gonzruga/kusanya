import {
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BulkMemberRowDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsMobilePhone()
  mobileNumber: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  defaultContribution?: number;
}
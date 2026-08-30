import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContributionStatus } from '@prisma/client';

export class UpdateContributionDto {

  @IsOptional()
  @IsEnum(ContributionStatus)
  status?: ContributionStatus;


  @IsOptional()
  @IsString()
  transactionReference?: string;

}
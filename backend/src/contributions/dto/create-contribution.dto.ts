import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { PaymentProvider } from '@prisma/client';

export class CreateContributionDto {

    // Note: memberId is intentionally omitted.
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsString()
  @IsNotEmpty()
  transactionReference: string;

  @IsOptional()
  @IsString()
  providerReference?: string;

//   @IsOptional()
//   @IsString()
//   currency: Currency;

//   @IsOptional()
//   @IsEnum(ContributionStatus)
//   status: ContributionStatus;

//Removed when creating from campaing page.
  @IsString()
  @IsNotEmpty()
  campaignId: string;

}
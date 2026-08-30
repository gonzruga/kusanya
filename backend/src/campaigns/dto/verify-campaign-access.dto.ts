import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCampaignAccessDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  campaignCode: string;
}
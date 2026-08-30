import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { CampaignCategory } from '@prisma/client';


export class CreateCampaignDto {

  @IsString()
  @IsNotEmpty()
  title: string;


  @IsOptional()
  @IsString()
  description: string;


  @IsOptional()
  @IsString()
  imageUrl?: string;


  @IsEnum(CampaignCategory)
  category: CampaignCategory;


  @IsOptional()
  @IsNumber()
  goal?: number;


  // @IsString()
  // @IsNotEmpty()
  // groupId: string;


  @IsNotEmpty()
  @IsDateString()
  startDate: Date;


  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

}
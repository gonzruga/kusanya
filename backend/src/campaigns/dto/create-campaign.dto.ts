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


  @IsString()
  @IsNotEmpty()
  description: string;


  @IsOptional()
  @IsString()
  imageUrl?: string;


  @IsEnum(CampaignCategory)
  category: CampaignCategory;


  @IsOptional()
  @IsNumber()
  goal?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  code?: string;

  // @IsString()
  // @IsNotEmpty()
  // groupId: string;


  @IsNotEmpty()
  @IsDateString()
  startDate: string;
  // startDate: Date;



  @IsNotEmpty()
  @IsDateString()
  endDate: string;
    // endDate: Date;


}
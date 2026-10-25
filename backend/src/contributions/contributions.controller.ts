 import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ContributionsService } from './contributions.service';

import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';

@Controller('contributions')
export class ContributionsController {

  constructor(
    private readonly contributionsService: ContributionsService,
  ) {}

  @Post()
  create(@Body() dto: CreateContributionDto) {
    return this.contributionsService.create(dto);
  }

  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  bulkUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('groupId') groupId: string,
  ) {

    return this.contributionsService.bulkUpload(
      file,
      groupId,
    );

  }

  @Get()
  findAll() {
    return this.contributionsService.findAll();
  }

  @Get('/campaign/:campaignId')
  findByCampaign(
    @Param('campaignId') campaignId: string,
  ) {
    return this.contributionsService.findByCampaign(
      campaignId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContributionDto,
  ) {
    return this.contributionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contributionsService.remove(id);
  }

}
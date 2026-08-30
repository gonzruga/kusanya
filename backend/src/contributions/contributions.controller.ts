 import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ContributionsService } from './contributions.service';

import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';

@Controller('contributions')
export class ContributionsController {

  constructor(
    private readonly contributionsService: ContributionsService,
  ) {}

//   @Post('campaign/:campaignId')
// createForCampaign(
//   @Param('campaignId') campaignId: string,
//   @Body() dto: CreateContributionDto,
// ) {
//   return this.contributionsService.createForCampaign(
//     campaignId,
//     dto,
//   );
// }

  @Post()
  create(@Body() dto: CreateContributionDto) {
    return this.contributionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.contributionsService.findAll();
  }

  // @Get('campaign/:campaignId')
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.contributionsService.findOne(id);
  // }

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
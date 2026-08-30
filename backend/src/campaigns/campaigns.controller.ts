import {
 Controller,
 Get,
 Post,
 Body,
 Param,
 Patch,
 Delete
} from '@nestjs/common';


import { CampaignsService } 
from './campaigns.service';


import { CreateCampaignDto }
from './dto/create-campaign.dto';


import { UpdateCampaignDto }
from './dto/update-campaign.dto';

import { VerifyCampaignAccessDto } 
from './dto/verify-campaign-access.dto';
//For access gate


@Controller('groups/:groupId/campaigns')
export class CampaignsController {


constructor(
 private readonly campaignsService:CampaignsService
){}

@Post("verify-access")
async verifyAccess(
  @Body() dto: VerifyCampaignAccessDto,
) {
  return this.campaignsService.verifyAccess(
    dto.campaignId,
    dto.campaignCode,
  );
}

@Post()
create(
  @Param('groupId') groupId: string,
  @Body() dto: CreateCampaignDto,
) {
  return this.campaignsService.create(groupId, dto);

}



@Get()
findAll(
  @Param('groupId') groupId: string,
) {
  return this.campaignsService.findByGroup(groupId);
}


@Get(':id')
findOne(
  @Param('groupId') groupId: string,
  @Param('id') id: string,
) {
  return this.campaignsService.findOne(groupId, id);
}


@Patch(':id')
update(
 @Param('groupId') groupId:string,
 @Param('id') id:string,
 @Body() dto:UpdateCampaignDto
){

 return this.campaignsService.update(
   groupId,
   id,
   dto
 );

}



@Delete(':id')
remove(
 @Param('groupId') groupId:string,
 @Param('id') id:string,
){
 return this.campaignsService.remove(groupId,id);
}


}
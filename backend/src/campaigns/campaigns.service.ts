import {
 Injectable,
 NotFoundException,
 ConflictException,
 //Access gate
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

import {
 CampaignStatus,
 Prisma
} from '@prisma/client';



@Injectable()
export class CampaignsService {

constructor(
 private prisma: PrismaService
){}


// CREATE

async create(groupId: string, dto: CreateCampaignDto){

 const group =
 await this.prisma.group.findUnique({
   where:{
     id:groupId
   }
 });


 if(!group){
   throw new NotFoundException(
    "Group not found"
   );
 }

  const startDate = new Date(dto.startDate);
  const endDate = new Date(dto.endDate);

  if (isNaN(startDate.getTime())) {
    throw new BadRequestException(
      "Invalid start date"
    );
  }

  if (isNaN(endDate.getTime())) {
    throw new BadRequestException(
      "Invalid end date"
    );
  }

  if (endDate < startDate) {
    throw new BadRequestException(
      "End date cannot be before start date"
    );
  }

 try {
  return this.prisma.campaign.create({

      data:{

        title:dto.title,

        description:dto.description,

        imageUrl:dto.imageUrl,

        category:dto.category,

        goal:dto.goal,

        groupId: groupId,
        // groupId,

        code: dto.code?.trim(),

        startDate: startDate,
        endDate: endDate,

        // startDate:dto.startDate,
        // endDate:dto.endDate,

        status:CampaignStatus.DRAFT

      },

      include:{
        group:true
      }

  });

  }  catch (error) {

      // Campaign code already exists
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Campaign code is already in use.'
        );
      }

      // Any other database error
      throw error;
  }
}
  


// FIND ALL

async findAll(){

 return this.prisma.campaign.findMany({

  where:{
    archivedAt:null
  },

  include:{
    group:true
  },

  orderBy:{
    createdAt:'desc'
  }

 });

}



// FIND BY ID

async findOne(groupId: string, id:string){

 const campaign =
 await this.prisma.campaign.findFirst({

  where:{
    id,
    groupId,
  },

  include:{
    group:true,
    contributions:true
  }

 });


 if(!campaign){

  throw new NotFoundException(
   "Campaign not found"
  );

 }


 return campaign;

}



// FIND CAMPAIGNS BY GROUP

async findByGroup(groupId:string){

 const group =
 await this.prisma.group.findUnique({
  where:{
    id:groupId
  }
 });


 if(!group){

  throw new NotFoundException(
   "Group not found"
  );

 }


 return this.prisma.campaign.findMany({

  where:{
    groupId,
    archivedAt:null
  },

  orderBy:{
    createdAt:'desc'
  }

 });

}



// UPDATE

async update(groupId: string, id: string, dto: UpdateCampaignDto){

 await this.findOne(groupId, id);


 return this.prisma.campaign.update({

  where:{
    id
  },

  data:dto

 });


}



// SOFT DELETE

async remove(groupId: string, id: string){

 await this.findOne(groupId, id);


 return this.prisma.campaign.update({

  where:{
    id
  },

  data:{
    status:CampaignStatus.ARCHIVED,
    archivedAt:new Date()
  }

 });


}


// VERIFY ACCESS

async verifyAccess(campaignId: string, campaignCode: string){ 
    const campaign = await this.prisma.campaign.findUnique({
    where: {
      id: campaignId,
    },
  });

  if (!campaign) {
    throw new NotFoundException('Campaign not found');
  }

  if (!campaign.code) {
    throw new BadRequestException(
      'This campaign does not have an access code',
    );
  }

  if (campaign.code !== campaignCode.trim()) {
    throw new UnauthorizedException(
      'Invalid campaign code',
    );
  }

  return {
    success: true,
    campaignId: campaign.id,
  };
}

}
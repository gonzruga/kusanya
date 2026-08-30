import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  ContributionStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionDto } from './dto/update-contribution.dto';

@Injectable()
export class ContributionsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateContributionDto) {

    const campaign = await this.prisma.campaign.findUnique({
      where: {
        id: dto.campaignId,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    const member = await this.prisma.member.findFirst({
      where: {
        groupId: campaign.groupId,
        mobileNumber: dto.mobileNumber,
      },
    });

    if (!member) {
      throw new NotFoundException(
        'Member not found in this group',
      );
    }

    // const existing =
    //   await this.prisma.contribution.findUnique({
    //     where: {
    //       transactionReference:
    //         dto.transactionReference,
    //     },
    //   });


    return this.prisma.$transaction(async (tx) => {

      const contribution =
        await tx.contribution.create({

          data: {
            amount: dto.amount,
            currency: campaign.currency ?? "TZS",
            mobileNumber: dto.mobileNumber,
            provider: dto.provider,
            providerReference: dto.providerReference,
            transactionReference:
              dto.transactionReference,

            campaignId: dto.campaignId,
            memberId: member.id,

            status: ContributionStatus.PENDING,
          },
        });

      return contribution;

    });

  }

  async findAll() {

    return this.prisma.contribution.findMany({

      include: {
        campaign: true,
        member: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

    });

  }

  async findOne(id: string) {

    const contribution =
      await this.prisma.contribution.findUnique({

        where: { id },

        include: {
          campaign: true,
          member: true,
        },

      });

    if (!contribution) {
      throw new NotFoundException(
        'Contribution not found',
      );
    }

    return contribution;

  }

  async findByCampaign(campaignId: string) {

    return this.prisma.contribution.findMany({

      where: {
        campaignId,
      },

      include: {
        member: true,
      },

      orderBy: {
        createdAt: 'desc',
      },

    });

  }

  async update(
    id: string,
    dto: UpdateContributionDto,
  ) {

    await this.findOne(id);

    return this.prisma.contribution.update({

      where: {
        id,
      },

      data: dto,

    });

  }

  async remove(id: string) {

    await this.findOne(id);

    return this.prisma.contribution.delete({

      where: {
        id,
      },

    });

  }

}
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { GroupStatus } from '@prisma/client';

@Injectable()
export class GroupsService {

  constructor(private prisma: PrismaService) {}

  // async create(createGroupDto: CreateGroupDto, ownerId: string) {
  //   // return 'This action adds a new group';
  //   return this.prisma.group.create({
  //   data: {
  //     name: createGroupDto.name,
  //     description: createGroupDto.description,
  //     ownerId: ownerId,
  //   },
  // });
  // }

  async create(createGroupDto: CreateGroupDto, ownerId: string) {
  const owner = await this.prisma.user.findUnique({
    where: { id: ownerId },
    select: { id: true },
  });

  if (!owner) {
    throw new NotFoundException(
      `Group owner not found. The supplied user ID does not exist.`,
    );
  }

  return this.prisma.group.create({
    data: {
      name: createGroupDto.name,
      description: createGroupDto.description,
      ownerId: owner.id,
    },
    });
  }

  async findAll() {
    // return `This action returns all groups`;
    return this.prisma.group.findMany({
    include: {
      owner: true,
    },
  });
  }


  async findOne(id: string) {

    const group = await this.prisma.group.findUnique({
        where: { id },
        include: {
            owner: true,
            members: true,
            campaigns: true,
        },
    });

    if (!group) {
        throw new NotFoundException('Group not found');
    }

  return group;
  }
  
  async update(id: string, updateGroupDto: UpdateGroupDto) {
    // return `This action updates a #${id} group`;
    return this.prisma.group.update({
    where: { id },    
    data: updateGroupDto,
  });
  }

  async remove(id: string) {
    // return `This action removes a #${id} group`;
      return this.prisma.group.update({
    where: {
      id,
    },
    data: {
      status: GroupStatus.ARCHIVED,
      archivedAt: new Date(),    },
  });
  }


  async getMemberData(groupId: string) {
  // ---------------------------------------------------------
  // MEMBERS
  // ---------------------------------------------------------

  const members = await this.prisma.$queryRaw<
    Array<{
      member_id: string;
      first_name: string | null;
      mobile_number: string;
      comment: string | null;
      default_contribution: number | null;
      average_contribution: number;
      total_contributed: number;
      campaigns_supported: number;
      behaviour_segment: string | null;
    }>
  >`
  SELECT

    member_id,

    first_name,

    mobile_number,

    comment,

    COALESCE(
      default_contribution,
      0
    )::float AS default_contribution,

    COALESCE(
      average_contribution,
      0
    )::float AS average_contribution,

    COALESCE(
      total_contributed,
      0
    )::float AS total_contributed,

    COALESCE(
      campaigns_supported,
      0
    )::int AS campaigns_supported,

    behaviour_segment

    FROM marts.member_behavior_segments

    WHERE group_id = ${groupId}

    ORDER BY
      first_name ASC NULLS LAST,
      mobile_number ASC
  `;

  // ---------------------------------------------------------
  // CONTRIBUTIONS
  // ---------------------------------------------------------

  const contributions = await this.prisma.$queryRaw<
    Array<{
      campaign_title: string;
      member_first_name: string | null;
      mobile_number: string;
      amount: number;
      transaction_reference: string;
      created_at: Date;
    }>
  >`
    SELECT

      c.title AS campaign_title,

      m."firstName" AS member_first_name,

      co.mobile_number,

      co.amount::float AS amount,

      co.transaction_reference,

      co.created_at

    FROM (
      SELECT
        c."campaignId" AS campaign_id,
        c."memberId" AS member_id,
        c."mobileNumber" AS mobile_number,
        c.amount as amount,
        c."transactionReference" AS transaction_reference,
        c."createdAt" AS created_at

      FROM "Contribution" c

      WHERE
        c.status = 'SUCCESSFUL'
    ) co

    INNER JOIN "Campaign" c
      ON c.id = co.campaign_id

    INNER JOIN "Member" m
      ON m.id = co.member_id

    WHERE
      c."groupId" = ${groupId}

    ORDER BY
      co.created_at DESC
  `;

  return {
    members,
    contributions,
  };
  
}

}

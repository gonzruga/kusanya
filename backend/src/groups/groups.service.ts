import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { GroupStatus } from '@prisma/client';

@Injectable()
export class GroupsService {

  constructor(private prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto, ownerId: string) {
    // return 'This action adds a new group';
    return this.prisma.group.create({
    data: {
      name: createGroupDto.name,
      description: createGroupDto.description,
      ownerId: ownerId,
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

  // async findOne(id: string) {
  //   // return `This action returns a #${id} group`;
  //   return this.prisma.group.findUnique({
  //   where: { id },
  //   include: {
  //     owner: true,
  //     members: true,
  //     campaigns: true,
  //   },
  // });
  // }

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
}

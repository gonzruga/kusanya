import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMemberDto) {
    const exists = await this.prisma.member.findFirst({
      where: {
        mobileNumber: dto.mobileNumber,
      },
    });

    if (exists) {
      throw new ConflictException(
        'Member already exists.',
      );
    }

    return this.prisma.member.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.member.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException(
        'Member not found',
      );
    }

    return member;
  }

  async update(id: string, dto: UpdateMemberDto) {
  await this.findOne(id);

  if (dto.mobileNumber) {
    const existing = await this.prisma.member.findFirst({
      where: {
        mobileNumber: dto.mobileNumber,
        NOT: { id },
      },
    });

    if (existing) {
      throw new ConflictException(
        'Mobile number already exists.',
      );
    }
  }

  return this.prisma.member.update({
    where: { id },
    data: dto,
  });
}

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.member.delete({
      where: { id },
    });
  }
}

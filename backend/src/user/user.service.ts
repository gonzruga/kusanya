import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class UserService  {
 
  constructor(private prisma: PrismaService) {}

  async findByMobileNumber(mobileNumber: string) {
  return this.prisma.user.findUnique({
    where: {
      mobileNumber,
    },
  });
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({ data });

 // Do not return the password
    const { password, ...safeUser } = user;

    return safeUser;

  }

   async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...safeUser } = user;

    return safeUser;
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  
}

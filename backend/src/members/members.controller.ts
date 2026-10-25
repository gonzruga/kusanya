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

import { MembersService } from './members.service';

import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

import { FileInterceptor } from '@nestjs/platform-express';

@Controller('members')
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
  ) {}

  @Post()
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @Post('bulk-upload')
  @UseInterceptors(FileInterceptor('file'))
  bulkUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body('groupId') groupId: string,
  ) {
    return this.membersService.bulkUpload(
      file,
      groupId,
    );
  }


  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
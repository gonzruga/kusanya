import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GroupsModule } from './groups/groups.module';
import { MembersModule } from './members/members.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ContributionsModule } from './contributions/contributions.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, GroupsModule, MembersModule, CampaignsModule, ContributionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// MembershipsModule,
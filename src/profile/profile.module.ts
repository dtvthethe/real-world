import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { ProfilesController } from './profiles.controller';
import { UserFollow } from 'src/users/user_follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserFollow]),
    UsersModule
  ],
  providers: [ProfileService],
  controllers: [ProfileController, ProfilesController]
})
export class ProfileModule {}

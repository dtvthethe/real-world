import { Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProfileService } from './profile.service';
import { UserProfileResponse } from './dto/user-profile-response';

@Controller('profiles')
export class ProfilesController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @Get('/:username')
    async find(@Param('username') username: string): Promise<any> {
        try {
            const user = await this.profileService.findByUsername(username);
            const userResponseTransform = plainToInstance(UserProfileResponse, user, { excludeExtraneousValues: true });

            return {
                profile: userResponseTransform
            };
        } catch (err) {
            console.log(err);
            return {
                message: err.message
            };
        }
    }

    @Post('/:username/follow')
    async follow(@Headers() headers, @Param('username') username: string): Promise<any> {
        try {
            const user = await this.profileService.follow(headers, username);
            const userResponseTransform = plainToInstance(UserProfileResponse, user, { excludeExtraneousValues: true });

            return {
                profile: userResponseTransform
            };
        } catch (err) {
            console.log(err);
            return {
                message: err.message
            };
        }
    }

    @Delete('/:username/follow')
    async unfollow(@Headers() headers, @Param('username') username: string): Promise<any> {
        try {
            return 1;
        } catch (err) {
            console.log(err);
            return {
                message: err.message
            };
        }
    }
}

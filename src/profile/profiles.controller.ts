import { Controller, Get, Param } from '@nestjs/common';
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
}

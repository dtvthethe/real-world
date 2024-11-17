import { Controller, Get, Headers } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponseDto } from 'src/users/dto/create-user-response.dto';
import { ProfileService } from './profile.service';

@Controller('user')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @Get('')
    async profile(@Headers() header): Promise<any> {
        try {
            const result = await this.profileService.detail(header);
            const userResponseTransform = plainToInstance(CreateUserResponseDto, result, { excludeExtraneousValues: true });

            return {
                user: userResponseTransform
            };
        } catch (err) {
            console.log(err);
            return {
                message: err.message
            };
        }
    }
}

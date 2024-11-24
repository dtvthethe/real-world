import { Body, Controller, Get, Headers, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponseDto } from 'src/users/dto/create-user-response.dto';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from './dto/update-user.dto';

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

    @Put('')
    async update(@Headers() header, @Body() body: UpdateUserDto): Promise<any> {
        try {
            const user = await this.profileService.update(header, body);

            return {
                user
            };
        } catch (err) {
            console.log(err);
            return {
                message: err.message
            };
        }
    }
}

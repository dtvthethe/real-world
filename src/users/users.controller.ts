import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponseDto } from './dto/create-user-response.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Post('')
    async create(@Body() userDto: CreateUserDto): Promise<any> {
        try {
            // convert username to userName
            const userRequestTransform = plainToInstance(CreateUserDto, userDto);
            // save user to DB
            const result = await this.usersService.create(userRequestTransform);
            // format respone
            const userResponseTransform = plainToInstance(CreateUserResponseDto, result, { excludeExtraneousValues: true });

            return {
                user: userResponseTransform
            };
        } catch (err) {
            console.log(err);
            return {
                message: 'save fail'
            };
        }
    }
}

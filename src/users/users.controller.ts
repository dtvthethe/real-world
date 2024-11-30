import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @ApiOperation({
        summary: 'Create user',
        description: 'Create user in the database',
    })
    @ApiBody({
        description: 'User request',
        examples: {
            default: {
                value: {
                    user: {
                        username: "Jacob",
                        email: "jake@jake.jake",
                        password: "jakejake"
                    }
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successful creare user',
        schema: {
            example: {
                user: {
                    email: "jake@jake.jake",
                    token: "jwt.token.here",
                    username: "jake",
                    bio: "I work at statefarm",
                    image: null
                }
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
            },
        },
    })
    @Post('')
    async create(@Body() userDto: CreateUserDto): Promise<any> {
        // convert username to userName
        const userRequestTransform = plainToInstance(CreateUserDto, userDto);
        // save user to DB
        const result = await this.usersService.create(userRequestTransform);
        // format respone
        const userResponseTransform = plainToInstance(CreateUserResponseDto, result, { excludeExtraneousValues: true });

        return {
            user: userResponseTransform
        };
    }

    @ApiOperation({
        summary: 'Login user',
        description: 'Login user in the database',
    })
    @ApiBody({
        description: 'User request',
        examples: {
            default: {
                value: {
                    user: {
                        email: "jake@jake.jake",
                        password: "jakejake"
                    }
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successful login user',
        schema: {
            example: {
                user: {
                    email: "jake@jake.jake",
                    token: "jwt.token.here",
                    username: "jake",
                    bio: "I work at statefarm",
                    image: null
                }
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 500,
                message: 'Internal server error',
            },
        },
    })
    @Post('login')
    async login(@Body() userDto: LoginUserDto): Promise<any> {
        const userRequestTransform = plainToInstance(LoginUserDto, userDto);
        const result = await this.usersService.login(userRequestTransform)
        const userResponseTransform = plainToInstance(CreateUserResponseDto, result, { excludeExtraneousValues: true });

        return {
            user: userResponseTransform
        };

    }
}

import { Body, Controller, Get, Headers, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateUserResponseDto } from 'src/users/dto/create-user-response.dto';
import { ProfileService } from './profile.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiSecurity('custom-token')
@ApiTags('user')
@Controller('user')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @ApiOperation({
        summary: 'Get user profile',
        description: 'Get user profile in the database',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful get user profile',
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
    @Get('')
    async profile(@Headers() header): Promise<any> {
        const result = await this.profileService.detail(header);
        const userResponseTransform = plainToInstance(CreateUserResponseDto, result, { excludeExtraneousValues: true });

        return {
            user: userResponseTransform
        };
    }

    @ApiOperation({
        summary: 'Update user',
        description: 'Update user in the database',
    })
    @ApiBody({
        description: 'User request',
        examples: {
            default: {
                value: {
                    user: {
                        email: "jake@jake.jake",
                        bio: "I like to skateboard",
                        image: "https://i.stack.imgur.com/xHWG8.jpg"
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
    @Put('')
    async update(@Headers() header, @Body() body: UpdateUserDto): Promise<any> {
        const user = await this.profileService.update(header, body);

        return {
            user
        };
    }
}

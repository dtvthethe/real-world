import { Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiSecurity('custom-token')
@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @ApiOperation({
        summary: 'Get profile',
        description: 'Get profile by username',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful get profile',
        schema: {
            example: {
                profile: {
                    username: "jake",
                    bio: "I work at statefarm",
                    image: "https://api.realworld.io/images/smiley-cyrus.jpg",
                    following: false
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
    @Get('/:username')
    async find(@Headers() headers, @Param('username') username: string): Promise<any> {
        try {
            const userDto = await this.profileService.findByUsername(headers, username);

            return {
                profile: userDto
            };
        } catch (err) {
            console.log(err);
            return {
                message: err.message
            };
        }
    }

    @ApiOperation({
        summary: 'Follow user',
        description: 'Follow user by username',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful follow user',
        schema: {
            example: {
                profile: {
                    username: "jake",
                    bio: "I work at statefarm",
                    image: "https://api.realworld.io/images/smiley-cyrus.jpg",
                    following: false
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
    @Post('/:username/follow')
    async follow(@Headers() headers, @Param('username') username: string): Promise<any> {
        try {
            const profile = await this.profileService.follow(headers, username);

            return {
                profile
            };
        } catch (error) {
            console.log(error);
            return {
                message: error.message
            };
        }
    }

    @ApiOperation({
        summary: 'Unfollow user',
        description: 'Unfollow user by username',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful unfollow user',
        schema: {
            example: {
                profile: {
                    username: "jake",
                    bio: "I work at statefarm",
                    image: "https://api.realworld.io/images/smiley-cyrus.jpg",
                    following: false
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
    @Delete('/:username/follow')
    async unfollow(@Headers() headers, @Param('username') username: string): Promise<any> {
        try {
            const profile = await this.profileService.unfollow(headers, username);

            return {
                profile
            };
        } catch (error) {
            console.log(error);
            return {
                message: error.message
            };
        }
    }
}

import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @ApiOperation({
        summary: 'Get tags',
        description: 'Get tags in the database',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful get tags',
        schema: {
            example: {
                tags: [
                    "reactjs",
                    "angularjs"
                ]
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
    async index(): Promise<any> {
        const tags = await this.tagsService.findAllNames();

        return {
            tags: tags
        };
    }
}

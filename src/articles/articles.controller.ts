import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiSecurity('custom-token')
@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ) { }

    @ApiOperation({
        summary: 'Get feed',
        description: 'Get feed in the database',
    })
    @ApiQuery({ name: 'limit', type: String, required: false, description: 'limit name', default: 20 })
    @ApiQuery({ name: 'offset', type: String, required: false, description: 'offset name', default: 0 })
    @ApiResponse({
        status: 200,
        description: 'Successful get feed',
        schema: {
            example:
            {
                articles: [{
                    slug: "how-to-train-your-dragon",
                    title: "How to train your dragon",
                    description: "Ever wonder how?",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
                }, {
                    slug: "how-to-train-your-dragon-2",
                    title: "How to train your dragon 2",
                    description: "So toothless",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
                }],
                articlesCount: 2
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
    @Get('feed')
    async feed(
        @Headers() headers,
        @Query('limit') limit: number = 20,
        @Query('offset') offset: number = 0
    ): Promise<any> {
        const result = await this.articlesService.findAll(headers, null, null, null, limit, offset, true);

        return {
            articles: result,
            articlesCount: result.length
        }
    }

    @ApiOperation({
        summary: 'Create article',
        description: 'Create article in the database',
    })
    @ApiBody({
        description: 'Article request',
        examples: {
            default: {
                value: {
                    article: {
                        title: "How to train your dragon",
                        description: "Ever wonder how?",
                        body: "You have to believe",
                        tagList: ["reactjs", "angularjs", "dragons"]
                    }
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successful create article',
        schema: {
            example: {
                article: {
                    slug: "how-to-train-your-dragon",
                    title: "How to train your dragon",
                    description: "Ever wonder how?",
                    body: "It takes a Jacobian",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
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
    async create(@Headers() headers, @Body() articleDto: CreateArticleDto): Promise<any> {
        const result = await this.articlesService.create(headers, articleDto);

        return {
            article: result
        }
    }

    @ApiOperation({
        summary: 'Update article',
        description: 'Update article in the database',
    })
    @ApiBody({
        description: 'Article request',
        examples: {
            default: {
                value: {
                    article: {
                        title: "Did you train your dragon?"
                    }
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successful update article',
        schema: {
            example: {
                article: {
                    slug: "how-to-train-your-dragon",
                    title: "Did you train your dragon?",
                    description: "Ever wonder how?",
                    body: "It takes a Jacobian",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
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
    @Put(':slug')
    async update(@Headers() headers, @Param('slug') slug: string, @Body() articleDto: UpdateArticleDto): Promise<any> {
        const result = await this.articlesService.update(headers, slug, articleDto);

        return {
            article: result
        }
    }

    @ApiOperation({
        summary: 'Delete article',
        description: 'Delete article in the database',
    })
    @ApiResponse({
        status: 200,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 200,
                message: 'Delete success',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 400,
                message: 'Delete fail',
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
    @Delete(':slug')
    async delete(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        const result = await this.articlesService.delete(headers, slug);

        if (result.affected) {
            return {
                message: 'Delete success'
            }
        }

        return {
            message: 'Delete fail'
        }
    }

    @ApiOperation({
        summary: 'Get articles',
        description: 'Get articles in the database',
    })
    @ApiQuery({ name: 'tag', type: String, required: false, description: 'tag name' })
    @ApiQuery({ name: 'author', type: String, required: false, description: 'author name' })
    @ApiQuery({ name: 'favorited', type: String, required: false, description: 'favorited name' })
    @ApiQuery({ name: 'limit', type: String, required: false, description: 'limit name', default: 20 })
    @ApiQuery({ name: 'offset', type: String, required: false, description: 'offset name', default: 0 })
    @ApiResponse({
        status: 200,
        description: 'Successful get articles',
        schema: {
            example:
            {
                articles: [{
                    slug: "how-to-train-your-dragon",
                    title: "How to train your dragon",
                    description: "Ever wonder how?",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
                }, {
                    slug: "how-to-train-your-dragon-2",
                    title: "How to train your dragon 2",
                    description: "So toothless",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
                }],
                articlesCount: 2
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
    async index(
        @Headers() headers,
        @Query('tag') tag?: string,
        @Query('author') author?: string,
        @Query('favorited') favorited?: string,
        @Query('limit') limit: number = 20,
        @Query('offset') offset: number = 0
    ): Promise<any> {
        const result = await this.articlesService.findAll(headers, tag, author, favorited, limit, offset);

        return {
            articles: result,
            articlesCount: result.length
        }
    }

    @ApiOperation({
        summary: 'Get article',
        description: 'Get article in the database',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful get article',
        schema: {
            example: {
                article: {
                    slug: "how-to-train-your-dragon",
                    title: "Did you train your dragon?",
                    description: "Ever wonder how?",
                    body: "It takes a Jacobian",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
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
    @Get(':slug')
    async find(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        const result = await this.articlesService.findOneBySlug(headers, slug);

        return {
            article: result
        }
    }

    @ApiOperation({
        summary: 'Create comment',
        description: 'Create comment in the database',
    })
    @ApiBody({
        description: 'Comment request',
        examples: {
            default: {
                value: {
                    comment: {
                        body: "His name was my name too."
                    }
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Successful create comment',
        schema: {
            example: {
                comment: {
                    id: 1,
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:22:56.637Z",
                    body: "It takes a Jacobian",
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
                }
            },
        }
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
    @Post(':slug/comments')
    async createComment(@Headers() headers, @Param('slug') slug: string, @Body() commentDto: CreateCommentDto): Promise<any> {
        const result = await this.articlesService.createComment(headers, slug, commentDto);

        return {
            comment: result
        };
    }

    @ApiOperation({
        summary: 'Get comments',
        description: 'Get comments in the database',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful get comments',
        schema: {
            example: {
                comments: [{
                    id: 1,
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:22:56.637Z",
                    body: "It takes a Jacobian",
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
                }]
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
    @Get(':slug/comments')
    async comments(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        const result = await this.articlesService.getComments(headers, slug);

        return {
            comments: result
        };
    }

    @ApiOperation({
        summary: 'Delete comment',
        description: 'Delete comment in the database',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful delete comment',
        schema: {
            example: {
                statusCode: 200,
                message: 'Delete success',
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Internal server error',
        schema: {
            example: {
                statusCode: 400,
                message: 'Delete fail',
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
    @Delete(':slug/comments/:id')
    async removeComment(@Headers() headers, @Param('slug') slug: string, @Param('id') id: number): Promise<any> {
        const result = await this.articlesService.deleteComment(headers, slug, id);

        if (result.affected) {
            return {
                message: 'Delete success'
            }
        }

        return {
            message: 'Delete fail'
        }
    }

    @ApiOperation({
        summary: 'Favorite article',
        description: 'Favorite article in the database',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful update article',
        schema: {
            example: {
                article: {
                    slug: "how-to-train-your-dragon",
                    title: "Did you train your dragon?",
                    description: "Ever wonder how?",
                    body: "It takes a Jacobian",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
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
    @Post(':slug/favorite')
    async favorite(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        const result = await this.articlesService.favorite(headers, slug);

        return {
            article: result
        }
    }

    @ApiOperation({
        summary: 'Unfavorite article',
        description: 'Unfavorite article in the database',
    })
    @ApiResponse({
        status: 200,
        description: 'Successful update article',
        schema: {
            example: {
                article: {
                    slug: "how-to-train-your-dragon",
                    title: "Did you train your dragon?",
                    description: "Ever wonder how?",
                    body: "It takes a Jacobian",
                    tagList: ["dragons", "training"],
                    createdAt: "2016-02-18T03:22:56.637Z",
                    updatedAt: "2016-02-18T03:48:35.824Z",
                    favorited: false,
                    favoritesCount: 0,
                    author: {
                        username: "jake",
                        bio: "I work at statefarm",
                        image: "https://i.stack.imgur.com/xHWG8.jpg",
                        following: false
                    }
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
    @Delete(':slug/favorite')
    async unfavorite(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        const result = await this.articlesService.unfavorite(headers, slug);

        return {
            article: result
        }
    }
}

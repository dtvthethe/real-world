import { Body, Controller, Delete, Get, Header, Headers, Param, Post, Put, Query } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { plainToInstance } from 'class-transformer';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ListArticleResponseDto } from './dto/list-article-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCommentResponseDto } from './dto/create-comment-response.dto';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ) { }

    @Post('')
    async create(@Headers() headers, @Body() articleDto: CreateArticleDto): Promise<any> {
        try {
            const result = await this.articlesService.create(headers, articleDto);

            return {
                article: result
            }
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Put(':slug')
    async update(@Headers() headers, @Param('slug') slug: string, @Body() articleDto: UpdateArticleDto): Promise<any> {
        try {
            const result = await this.articlesService.update(headers, slug, articleDto);

            return {
                article: result
            }
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Delete(':slug')
    async delete(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        try {
            const result = await this.articlesService.delete(headers, slug);

            if (result.affected) {
                return {
                    message: 'Delete success'
                }
            }

            return {
                message: 'Delete fail'
            }
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Get('')
    async index(
        @Headers() headers,
        @Query('tag') tag?: string,
        @Query('author') author?: string,
        @Query('favorited') favorited?: string,
        @Query('limit') limit: number = 20,
        @Query('offset') offset: number = 0
    ): Promise<any> {
        try {
            const result = await this.articlesService.findAll(headers, tag, author, favorited, limit, offset);

            return {
                articles: result,
                articlesCount: result.length
            }
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Get(':slug')
    async find(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        try {
            const result = await this.articlesService.findOneBySlug(headers, slug);

            return {
                article: result
            }
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Post(':slug/comments')
    async createComment(@Headers() headers, @Param('slug') slug: string, @Body() commentDto: CreateCommentDto): Promise<any> {
        try {
            const result = await this.articlesService.createComment(headers, slug, commentDto);

            return {
                comment: result
            };
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Get(':slug/comments')
    async comments(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        try {
            const result = await this.articlesService.getComments(headers, slug);

            return {
                comments: result
            };
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Delete(':slug/comments/:id')
    async removeComment(@Headers() headers, @Param('slug') slug: string, @Param('id') id: number): Promise<any> {
        try {
            const result = await this.articlesService.deleteComment(headers, slug, id);

            if (result.affected) {
                return {
                    message: 'Delete success'
                }
            }

            return {
                message: 'Delete fail'
            }
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Post(':slug/favorite')
    async favorite(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        try {
            const result = await this.articlesService.favorite(headers, slug);

            return {
                article: result
            }
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }

    @Delete(':slug/favorite')
    async unfavorite(@Headers() headers, @Param('slug') slug: string): Promise<any> {
        try {
            const result = await this.articlesService.unfavorite(headers, slug);

            return {
                article: result
            }
        } catch (error) {
            console.log(error);

            return {
                message: error.message
            }
        }
    }
}

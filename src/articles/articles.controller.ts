import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { plainToInstance } from 'class-transformer';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DeleteResult } from 'typeorm';
import { ListArticleResponseDto } from './dto/list-article-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateCommentResponseDto } from './dto/create-comment-response.dto';

@Controller('articles')
export class ArticlesController {
    constructor(
        private readonly articlesService: ArticlesService
    ) { }

    @Post('')
    async create(@Body() articleDto: CreateArticleDto): Promise<any> {
        try {
            const result = await this.articlesService.create(articleDto);
            const articleResponseTransform = plainToInstance(CreateArticleResponseDto, result, { excludeExtraneousValues: true });

            return {
                article: articleResponseTransform
            }
        } catch (err) {
            return {
                message: 'save fail'
            }
        }
    }

    @Put(':slug')
    async update(@Param('slug') slug: string, @Body() articleDto: UpdateArticleDto): Promise<any> {
        try {
            const result = await this.articlesService.update(slug, articleDto);
            const articleResponseTransform = plainToInstance(CreateArticleResponseDto, result, { excludeExtraneousValues: true });

            return {
                article: articleResponseTransform
            }
        } catch (error) {
            console.log(error);
            return {
                message: 'save fail'
            }
        }
    }

    @Delete(':slug')
    async delete(@Param('slug') slug: string): Promise<any> {
        try {
            const result:DeleteResult = await this.articlesService.delete(slug);

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
                message: 'save fail'
            }
        }
    }

    @Get('')
    async index(@Query('tag') tag?: string, @Query('author') author?: string, @Query('limit') limit: number = 20, @Query('offset') offset: number = 0): Promise<any> {
        try {
            const articles = await this.articlesService.findAll(tag, author, limit, offset);
            const articlesResponseTransform = articles.map(article => plainToInstance(ListArticleResponseDto, article, { excludeExtraneousValues: true }));

            return {
                articles: articlesResponseTransform,
                articlesCount: articles.length
            }
        } catch (error) {
            console.log(error);
            return {
                message: 'save fail'
            }
        }
    }

    @Get(':slug')
    async find(@Param('slug') slug: string): Promise<any> {
        try {
            const articles = await this.articlesService.findOneBySlug(slug);
            const articlesResponseTransform = plainToInstance(CreateArticleResponseDto, articles, { excludeExtraneousValues: true });

            return {
                article: articlesResponseTransform
            }
        } catch (error) {
            console.log(error);
            return {
                message: 'save fail'
            }
        }
    }

    @Post(':slug/comments')
    async createComment(@Param('slug') slug: string, @Body() commentDto: CreateCommentDto): Promise<any> {
        try {
            const comment = await this.articlesService.createComment(slug, commentDto);
            const result = plainToInstance(CreateCommentResponseDto, comment, { excludeExtraneousValues: true });

            return {
                comment: result
            };
        } catch (error) {
            console.log(error);
            return {
                message: 'save fail'
            }
        }
    }

    @Get(':slug/comments')
    async comments(@Param('slug') slug: string): Promise<any> {
        try {
            const comments = await this.articlesService.getComments(slug);
            const result = comments.map(comment => plainToInstance(CreateCommentResponseDto, comment, { excludeExtraneousValues: true }));

            return {
                comments: result
            };
        } catch (error) {
            console.log(error);
            return {
                message: 'save fail'
            }
        }
    }

    @Delete(':slug/comments/:id')
    async removeComment(@Param('slug') slug: string, @Param('id') id: number): Promise<any> {
        try {
            const result:DeleteResult = await this.articlesService.deleteComment(slug, id);

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
                message: 'save fail'
            }
        }
    }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { plainToInstance } from 'class-transformer';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DeleteResult } from 'typeorm';
import { ListArticleResponseDto } from './dto/list-article-response.dto';

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
}

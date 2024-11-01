import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { plainToInstance } from 'class-transformer';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

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
}

import { Body, Controller, Post } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticlesService } from './articles.service';
import { plainToInstance } from 'class-transformer';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';

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
}

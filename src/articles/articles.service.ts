import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from 'src/users/user.entity';
import { TagsService } from 'src/tags/tags.service';
import slug from 'slugify';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articlesRepository: Repository<Article>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly tagService: TagsService
    ) { }

    async create(articleDto: CreateArticleDto): Promise<Article> {
        // TODO: hard code
        const author = await this.userRepository.findOneBy({ id: 1 });
        // TODO: End hard code

        const tags = await this.tagService.saveMultipleTag(articleDto.article.tagList)
        const article = this.articlesRepository.create({
            ...articleDto.article,
            author: author,
            tags,
            slug: slug(articleDto.article.title, { lower: true })
        });

        return await this.articlesRepository.save(article);
    }

    async update(slug: string, articleDto: UpdateArticleDto): Promise<Article> {
        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['tags']
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const updatedArticle = this.articlesRepository.merge(article, articleDto.article);

        return await this.articlesRepository.save(updatedArticle);
    }
}

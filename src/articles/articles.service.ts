import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { User } from 'src/users/user.entity';
import { TagsService } from 'src/tags/tags.service';
import slug from 'slugify';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Comment } from 'src/users/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articlesRepository: Repository<Article>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Comment)
        private readonly commentRepositoty: Repository<Comment>,
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

    async delete(slug: string): Promise<DeleteResult> {
        const article = this.articlesRepository.findBy({ slug });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        return await this.articlesRepository.delete({ slug });
    }

    async findAll(tag?: string, author?: string, limit: number = 20, offset: number = 0): Promise<Article[]> {
        const query = this.articlesRepository.createQueryBuilder('article');

        // join
        query.innerJoinAndSelect('article.tags', 'tag');
        query.innerJoinAndSelect('article.author', 'author');

        // filter
        if (tag) {
            query.andWhere('tag.name LIKE :name', { name: `%${tag}%` });
        }

        if (author) {
            query.andWhere('author.userName LIKE :name', { name: `%${author}%` });
        }

        // sort
        query.orderBy('article.id', 'ASC');

        // paginate
        query.skip(offset).take(limit);

        return await query.getMany();
    }

    async findOneBySlug(slug: string): Promise<Article> {
        return await this.articlesRepository.findOne({
            where: { slug },
            relations: ['author', 'tags']
        });
    }

    async createComment(slug: string, commentDto: CreateCommentDto): Promise<Comment> {
        // TODO: hard code
        const author = await this.userRepository.findOneBy({ id: 1 });
        // TODO: end hard code

        const article = await this.articlesRepository.findOneBy({ slug });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const comment = this.commentRepositoty.create({
            ...commentDto.comment,
            author,
            article
        });

        return await this.commentRepositoty.save(comment);
    }

    async getComments(slug: string): Promise<Comment[]> {
        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['comments', 'comments.author']
        });

        return article ? article.comments : [];
    }

    async deleteComment(slug: string, id: number): Promise<DeleteResult> {
        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['comments']
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const comment = article.comments.find(c => c.id == id);

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        return await this.commentRepositoty.delete({ id });
    }
}

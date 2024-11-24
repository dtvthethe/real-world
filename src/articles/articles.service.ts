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
import { ProfileService } from 'src/profile/profile.service';
import { plainToInstance } from 'class-transformer';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articlesRepository: Repository<Article>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Comment)
        private readonly commentRepositoty: Repository<Comment>,
        private readonly tagService: TagsService,
        private readonly profileService: ProfileService
    ) { }

    async create(headers: any, articleDto: CreateArticleDto): Promise<CreateArticleResponseDto> {
        const author = await this.profileService.detail(headers);

        if (!author) {
            throw new Error('User not found');
        }

        const tags = await this.tagService.saveMultipleTag(articleDto.article.tagList)
        const articleCreate = this.articlesRepository.create({
            ...articleDto.article,
            author,
            tags,
            slug: slug(articleDto.article.title, { lower: true })
        });
        const article = await this.articlesRepository.save(articleCreate);

        return plainToInstance(
            CreateArticleResponseDto,
            {
                ...article,
                favorited: false,
                favoritesCount: 0,
                author: {
                    ...article.author,
                    following: false
                }
            },
            { excludeExtraneousValues: true }
        );
    }

    async update(headers: any, slug: string, articleDto: UpdateArticleDto): Promise<CreateArticleResponseDto> {
        const author = await this.profileService.detail(headers);

        if (!author) {
            throw new Error('User not found');
        }

        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['tags', 'userFavorites', 'author']
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        if (article.author.id != author.id) {
            throw new Error('Unauthorized');
        }

        article.slug = slugify(articleDto.article.title);
        const updatedArticle = this.articlesRepository.merge(article, articleDto.article);
        const articleSaved = await this.articlesRepository.save(updatedArticle);

        return plainToInstance(
            CreateArticleResponseDto,
            {
                ...articleSaved,
                favorited: (article.userFavorites.find(user => user.id == author.id)) ? true : false,
                favoritesCount: article.userFavorites.length,
                author: {
                    ...author,
                    following: false
                }
            },
            { excludeExtraneousValues: true }
        );
    }

    async delete(headers: any, slug: string): Promise<DeleteResult> {
        const author = await this.profileService.detail(headers);

        if (!author) {
            throw new Error('User not found');
        }

        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['author']
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        if (author.id != article.author.id) {
            throw new Error('Unauthorized');
        }

        return await this.articlesRepository.delete({ slug });
    }

    async findAll(
        tag?: string,
        author?: string,
        favorited?: string,
        limit: number = 20,
        offset: number = 0
    ): Promise<Article[]> {
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

        // if (favorited) {
        //     query.andWhere('author.userName LIKE :name', { name: `%${author}%` });
        // }

        // sort
        query.orderBy('article.id', 'DESC');

        // paginate
        query.skip(offset).take(limit);

        return await query.getMany();
    }

    async findOneBySlug(headers: any, slug: string): Promise<CreateArticleResponseDto> {
        let userLogin = null;
        let favorited = false;

        if (headers.authorization) {
            userLogin = await this.profileService.detail(headers);

            if (!userLogin) {
                throw new Error('User not found');
            }
        }

        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['author', 'tags', 'userFavorites']
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        favorited = userLogin
            ? (article.userFavorites.find(user => user.id == userLogin.id)) ? true : false
            : false;

        return plainToInstance(
            CreateArticleResponseDto,
            {
                ...article,
                favorited,
                favoritesCount: article.userFavorites.length,
                author: {
                    ...article.author,
                    following: false
                }
            },
            { excludeExtraneousValues: true }
        );
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

    async favorite(headers: any, slug: string): Promise<CreateArticleResponseDto> {
        const userLogin = await this.profileService.detail(headers);

        if (!userLogin) {
            throw new Error('User not found');
        }

        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['author', 'tags', 'userFavorites']
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const userFavorite = article.userFavorites.find(user => user.id == userLogin.id);

        if (userFavorite) {
            throw new Error('User has already favorite this article');
        }

        article.userFavorites.push(userLogin);
        await this.articlesRepository.save(article);
        const user = await this.profileService.buildUserByUsername(headers, article.author.userName);
        console.log(user);


        return plainToInstance(
            CreateArticleResponseDto,
            {
                ...article,
                favorited: true,
                favoritesCount: article.userFavorites.length,
                author: user
            },
            { excludeExtraneousValues: true }
        );
    }

    async unfavorite(headers: any, slug: string): Promise<CreateArticleResponseDto> {
        const userLogin = await this.profileService.detail(headers);

        if (!userLogin) {
            throw new Error('User not found');
        }

        const article = await this.articlesRepository.findOne({
            where: { slug },
            relations: ['author', 'tags', 'userFavorites']
        });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        // TODO: neu favotire la 1M thi find lau
        const userFavorite = article.userFavorites.find(user => user.id == userLogin.id);

        if (userFavorite == undefined) {
            throw new Error("User wasn't favorite this article");
        }

        article.userFavorites = article.userFavorites.filter(user => user.id != userLogin.id)
        await this.articlesRepository.save(article);
        const user = await this.profileService.buildUserByUsername(headers, article.author.userName);

        return plainToInstance(
            CreateArticleResponseDto,
            {
                ...article,
                favorited: false,
                favoritesCount: article.userFavorites.length,
                author: user
            },
            { excludeExtraneousValues: true }
        );
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { TagsService } from 'src/tags/tags.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Comment } from 'src/users/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ProfileService } from 'src/profile/profile.service';
import { plainToInstance } from 'class-transformer';
import { CreateArticleResponseDto } from './dto/create-article-response.dto';
import slugify from 'slugify';
import { CreateCommentResponseDto } from './dto/create-comment-response.dto';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private readonly articlesRepository: Repository<Article>,
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
            slug: slugify(articleDto.article.title, { lower: true })
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

    async createComment(headers: any, slug: string, commentDto: CreateCommentDto): Promise<CreateCommentResponseDto> {
        const author = await this.profileService.detail(headers);

        if (!author) {
            throw new Error('User not found');
        }

        const article = await this.articlesRepository.findOneBy({ slug });

        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const comment = this.commentRepositoty.create({
            ...commentDto.comment,
            author,
            article
        });
        const commentSaved = await this.commentRepositoty.save(comment);

        return plainToInstance(
            CreateCommentResponseDto,
            {
                ...commentSaved,
                author: {
                    ...commentSaved.author,
                    following: false
                }
            },
            { excludeExtraneousValues: true }
        );
    }

    async getComments(headers: any, slug: string): Promise<CreateCommentResponseDto[]> {
        let author = null;

        if (headers.authorization) {
            author = await this.profileService.detail(headers);

            if (!author) {
                throw new Error('User not found');
            }
        }

        const comments = await this.commentRepositoty.find({
            where: {
                article: {
                    slug
                }
            },
            relations: ['author', 'author.following.followee']
        });
        const result = comments.map(comment => plainToInstance(
            CreateCommentResponseDto,
            {
                ...comment,
                author: {
                   ...comment.author,
                    following: author
                        ? (comment.author.following.find(f => f.followee.id == author.id)) ? true : false
                        : false
                }
            },
            { excludeExtraneousValues: true })
        );

        return result;
    }

    async deleteComment(headers: any, slug: string, id: number): Promise<DeleteResult> {
        const author = await this.profileService.detail(headers);

        if (!author) {
            throw new Error('User not found');
        }

        const comment = await this.commentRepositoty.findOne({
            where: {
                id,
                article: { slug }
            },
            relations: ['author']
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.author.id != author.id) {
            throw new Error('User not authorized to delete this comment');
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

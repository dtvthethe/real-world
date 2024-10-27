import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User, Tag]),
    TagsModule
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService]
})
export class ArticlesModule {}

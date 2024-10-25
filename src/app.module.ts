import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tags/tag.entity';
import { User } from './users/user.entity';
import { Article } from './articles/article.entity';
import { Comment } from './users/comment.entity';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 13306,
      username: 'root',
      password: 'Aa@123456',
      database: 'real-world',
      entities: [Tag, User, Article, Comment],
      synchronize: true,// disable for production
    }),
    TagsModule,
    ArticlesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

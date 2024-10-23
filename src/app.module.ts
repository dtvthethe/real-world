import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './article/article.module';
import { TagModule } from './tag/tag.module';
import { Tag } from './tag/tag.entity';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { Article } from './article/article.entity';
import { Comment } from './user/comment.entity';

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
    ArticleModule,
    TagModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

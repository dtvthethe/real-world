import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tags/tag.entity';
import { User } from './users/user.entity';
import { Article } from './articles/article.entity';
import { Comment } from './users/comment.entity';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { UserFollow } from './users/user_follow.entity';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 13306,
      username: 'root',
      password: 'Aa@123456',
      database: 'real-world',
      entities: [Tag, User, Article, Comment, UserFollow],
      synchronize: true,// disable for production
      // logging: true
    }),
    TagsModule,
    ArticlesModule,
    UsersModule,
    ProfileModule,
  ]
})
export class AppModule { }

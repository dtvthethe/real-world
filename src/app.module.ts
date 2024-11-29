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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({// config for env file
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({// config for database
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Tag, User, Article, Comment, UserFollow],
        synchronize: true,// disable for production
        // logging: true
      }),
    }),
    TagsModule,
    ArticlesModule,
    UsersModule,
    ProfileModule,
  ]
})
export class AppModule { }

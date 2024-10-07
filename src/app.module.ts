import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 13306,
      username: 'root',
      password: 'Aa@123456',
      database: 'real-world',
      entities: [],
      // synchronize: true,// disable for product
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

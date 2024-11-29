import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { TagSeed } from './tag.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const userSeed = app.get(TagSeed);

  await userSeed.seed();
  await app.close();
}

bootstrap();


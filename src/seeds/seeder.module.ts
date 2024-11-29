import { Module } from "@nestjs/common";
import { TagSeed } from "./tag.seed";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "src/tag/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagSeed],
  exports: [TagSeed]
})
export class SeederModule{}

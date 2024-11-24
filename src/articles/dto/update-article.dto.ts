import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

class ArticleDto {
    @IsOptional()
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    body?: string;
}

export class UpdateArticleDto {
    @ValidateNested()
    @Type(() => ArticleDto)
    article: ArticleDto;
}

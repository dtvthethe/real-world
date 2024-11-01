import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class ArticleDto {
    @IsNotEmpty()
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

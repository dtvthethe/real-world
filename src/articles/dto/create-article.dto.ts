import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

class ArticleDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    body: string;

    @IsArray()
    tagList: string[];
}

export class CreateArticleDto {
    @ValidateNested()
    @Type(() => ArticleDto)
    article: ArticleDto;
}

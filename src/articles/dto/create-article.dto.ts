import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

class ArticleDto {
    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;

    @IsString()
    readonly body: string;

    @IsArray()
    readonly tagList: string[];
}

export class CreateArticleDto {
    @ValidateNested()
    @Type(() => ArticleDto)
    readonly article: ArticleDto;
}

import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

class ArticleDto {
    @IsOptional()
    @IsString()
    readonly title!: string;

    @IsOptional()
    @IsString()
    readonly description?: string;

    @IsOptional()
    @IsString()
    readonly body?: string;
}

export class UpdateArticleDto {
    @ValidateNested()
    @Type(() => ArticleDto)
    readonly article: ArticleDto;
}

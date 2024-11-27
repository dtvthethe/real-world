import { Expose, Transform, Type } from "class-transformer";
import { Tag } from "src/tags/tag.entity";
import { AuthorResponseDto } from "./author-response.dto";

export class ListArticleResponseDto {
    @Expose()
    readonly slug: string;

    @Expose()
    readonly title: string;

    @Expose()
    readonly description: string;

    @Expose({ name: 'tags' })
    @Transform(({ value }) => value.map((tag: Tag) => tag.name))
    readonly tagList: string[];

    @Expose({ name: 'createdDate' })
    readonly createdAt: string;

    @Expose({ name: 'updatedDate' })
    readonly updatedAt: string;

    @Expose()
    readonly favorited: boolean;

    @Expose()
    readonly favoritesCount: number;

    @Expose()
    @Type(() => AuthorResponseDto)
    readonly author: AuthorResponseDto;
}

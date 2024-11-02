import { Expose, Transform, Type } from "class-transformer";
import { Tag } from "src/tags/tag.entity";
import { AuthorResponseDto } from "./author-response.dto";

export class ListArticleResponseDto {
    @Expose()
    slug: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose({ name: 'tags' })
    @Transform(({ value }) => value.map((tag: Tag) => tag.name))
    tagList: string[];

    @Expose({ name: 'createdDate' })
    createdAt: string;

    @Expose({ name: 'updatedDate' })
    updatedAt: string;

    // favorited: string;

    @Expose()
    favoritesCount: number;

    @Expose()
    @Type(() => AuthorResponseDto)
    author: AuthorResponseDto;
}

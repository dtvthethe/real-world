import { Expose, Transform } from "class-transformer";
import { Tag } from "src/tags/tag.entity";

class AuthorResponseDto {
    username: string;

    @Expose()
    bio: string;
    image: string;
    following: boolean;
}

export class CreateArticleResponseDto {
    @Expose()
    slug: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    body: string;

    // @Transform(({ value }: { value: Tag[] }) => value.map(tag => tag.name))
    @Expose({ name: 'tags' })
    tagList: string[];

    @Expose({ name: 'createdDate' })
    createdAt: string;

    @Expose({ name: 'updatedDate' })
    updatedAt: string;

    // favorited: string;

    @Expose()
    favoritesCount: number;

    @Expose()
    author: AuthorResponseDto;
}

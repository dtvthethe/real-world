import { Expose, Type } from "class-transformer";
import { AuthorResponseDto } from "./author-response.dto";

export class CreateCommentResponseDto {
    @Expose()
    id: string;

    @Expose({ name: 'createdDate' })
    createdAt: string;

    @Expose({ name: 'updatedDate' })
    updatedAt: string;

    @Expose()
    body: string;

    @Expose()
    @Type(() => AuthorResponseDto)
    author: AuthorResponseDto
}

import { Expose, Type } from "class-transformer";
import { AuthorResponseDto } from "./author-response.dto";

export class CreateCommentResponseDto {
    @Expose()
    readonly id: string;

    @Expose({ name: 'createdDate' })
    readonly createdAt: string;

    @Expose({ name: 'updatedDate' })
    readonly updatedAt: string;

    @Expose()
    readonly body: string;

    @Expose()
    @Type(() => AuthorResponseDto)
    readonly author: AuthorResponseDto
}

import { Expose } from "class-transformer";

export class AuthorResponseDto {
    @Expose({ name: "userName" })
    username: string;

    @Expose()
    bio: string;

    @Expose()
    image: string;

    @Expose()
    following: boolean;
}

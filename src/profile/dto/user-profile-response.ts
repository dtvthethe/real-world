import { Expose, Transform } from "class-transformer";

export class UserProfileResponse {
    @Expose({ name: 'userName' })
    username: string;

    @Expose()
    bio: string;

    @Expose()
    image: string;

    @Expose()
    @Transform(({ value }) => value && value.length > 0)
    following: boolean = false;
}

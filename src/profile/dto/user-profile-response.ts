import { Expose } from "class-transformer";

export class UserProfileResponse {
    @Expose({ name: 'userName' })
    readonly username: string;

    @Expose()
    readonly bio: string;

    @Expose()
    readonly image: string;

    @Expose()
    readonly following: boolean;
}

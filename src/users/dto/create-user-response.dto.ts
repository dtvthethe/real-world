import { Expose } from 'class-transformer';

export class CreateUserResponseDto {
    @Expose()
    email: string;

    @Expose({ name: 'accessToken' })
    token: string;

    @Expose()
    username: string;

    @Expose()
    bio: string;

    @Expose()
    image: string;
}

import { Expose } from 'class-transformer';

export class CreateUserResponseDto {
    @Expose()
    email: string;

    @Expose()
    token: string;

    @Expose({ name: 'userName'})
    username: string;

    @Expose()
    bio: string;

    @Expose()
    image: string;
}

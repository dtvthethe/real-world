import { Expose } from 'class-transformer';

export class CreateUserResponseDto {
    @Expose()
    readonly email: string;

    @Expose()
    readonly token: string;

    @Expose({ name: 'userName'})
    readonly username: string;

    @Expose()
    readonly bio: string;

    @Expose()
    readonly image: string;
}

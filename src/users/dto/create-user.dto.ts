import { Expose, Type } from "class-transformer";
import { IsEmail, IsString, MaxLength, ValidateNested } from "class-validator";

class UserDto {
    @IsEmail({}, { message: 'custom msg email must be an email' })
    readonly email: string;

    @IsString()
    password: string;

    @IsString()
    @Expose({ name: 'username' })
    readonly userName: string;
}

export class CreateUserDto {
    @ValidateNested()
    @Type(() => UserDto) // convert struct api {user: {...}} to User object
    readonly user: UserDto;
} 

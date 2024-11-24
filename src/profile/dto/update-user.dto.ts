import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class UserDto {
    @IsOptional()
    @IsEmail({}, { message: 'custom msg email must be an email' })
    @IsNotEmpty({ message: 'email is not empty' })
    email: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'username is not empty' })
    username: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'password is not empty' })
    password: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'image is not empty' })
    image: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'bio is not empty' })
    bio: string;
}

export class UpdateUserDto {
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;
}

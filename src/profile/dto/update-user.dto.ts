import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class UserDto {
    @IsOptional()
    @IsEmail({}, { message: 'custom msg email must be an email' })
    @IsNotEmpty({ message: 'email is not empty' })
    readonly email: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'username is not empty' })
    readonly username: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'password is not empty' })
    readonly password: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'image is not empty' })
    readonly image: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'bio is not empty' })
    readonly bio: string;
}

export class UpdateUserDto {
    @ValidateNested()
    @Type(() => UserDto)
    readonly user: UserDto;
}

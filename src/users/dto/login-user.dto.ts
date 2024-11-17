import { Expose, Type } from "class-transformer";
import { IsEmail, IsString, MaxLength, ValidateNested } from "class-validator";

class UserDto {
    @IsString()
    password: string;

    @IsEmail({}, { message: 'custom msg email must be an email' })
    email: string;
}

export class LoginUserDto {
    @ValidateNested()
    @Type(() => UserDto)
    user: UserDto;
} 

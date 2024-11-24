import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthService
    ) { }

    async create(userDto: CreateUserDto): Promise<any> {
        const user = userDto.user;

        // create password
        user.password = await this.authService.createPassword(user.password);
        // save user to DB
        const newUser = this.userRepository.create(userDto.user);
        const userSaved = await this.userRepository.save(newUser);
        // generate access token
        const token = this.authService.generateAccessToken(userSaved);

        return {
            ...userSaved,
            token,
        };
    }

    async login(userDto: LoginUserDto): Promise<any> {
        const user = userDto.user;
        const userSaved = await this.userRepository.findOneBy({
            email: user.email,
        });

        if (!userSaved) {
            throw new Error('User not found');
        }

        const isMatchPassword = await this.authService.comparePassword(user.password, userSaved.password);

        if (!isMatchPassword) {
            throw new Error('Invalid password');
        }

        const token = this.authService.generateAccessToken(userSaved);

        return {
            email: userSaved.email,
            token,
            username: userSaved.userName,
            image: userSaved.image,
            bio: userSaved.bio
        };
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthService
    ) {}

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
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly authService: AuthService
    ) { }

    async detail(header: any): Promise<User> {
        const headerToken = header.authorization;
        const result = this.authService.validateToken(headerToken);
        const userSaved = await this.userRepository.findOneBy({ id: result.sub });

        return userSaved;
    }

    async update(header: any, userDto: UpdateUserDto): Promise<User> {
        const userSaved = await this.detail(header);

        if (!userSaved) {
            throw new Error('User not found');
        }

        const { user } = userDto;

        if (user.password) {
            user.password = await this.authService.createPassword(user.password);
        }

        const newProfile = {
            ...userSaved,
            ...user
        }
        const updatedUser = this.userRepository.merge(userSaved, newProfile);

        return await this.userRepository.save(updatedUser);
    }
}

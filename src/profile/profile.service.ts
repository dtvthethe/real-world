import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFollow } from 'src/users/user_follow.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserFollow)
        private readonly userFollowRepository: Repository<UserFollow>,
        private readonly authService: AuthService
    ) { }

    async findByUsername(username: string): Promise<User> {
        return await this.userRepository.findOne({
            where: { userName: username },
            relations: ['following', 'followers']
        });
    }

    async detail(header: any): Promise<User> {
        const result = this.authService.validateToken(header.authorization);

        return await this.userRepository.findOne({
            where: { id: result.sub },
            relations: ['following', 'followers']
        });
    }

    async update(header: any, userDto: UpdateUserDto): Promise<User> {
        const userSaved = await this.detail(header);

        if (!userSaved) {
            throw new Error('Authentication error');
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

    async follow(header: any, username: string): Promise<User> {
        // get the user by token
        const userSaved = await this.detail(header);

        if (!userSaved) {
            throw new Error('Authentication error');
        }

        // get the user to follow
        const userToFollow = await this.userRepository.findOneBy({ userName: username });

        if (!userToFollow) {
            throw new Error('User to follow not found');
        }

        // create user follow
        const userFollow = new UserFollow();
        userFollow.followee = userSaved;
        userFollow.follower = userToFollow;
        const createdUserFollow = this.userFollowRepository.create(userFollow);
        await this.userFollowRepository.save(createdUserFollow);

        const refreshUser = await this.userRepository.findOne({
            where: { id: userSaved.id },
            relations: ['following']
        });

        return refreshUser;
    }
}

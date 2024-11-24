import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFollow } from 'src/users/user_follow.entity';
import { UserProfileResponse } from './dto/user-profile-response';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserFollow)
        private readonly userFollowRepository: Repository<UserFollow>,
        private readonly authService: AuthService
    ) { }

    async findByUsername(header: any, username: string): Promise<UserProfileResponse> {
        const userSaved = await this.detail(header);

        if (!userSaved) {
            throw new Error('User not found');
        }

        const userFollow = await this.userRepository.findOne({
            where: {
                userName: username,
                followers: {
                    follower: {
                        id: userSaved.id
                    }
                }
            },
            relations: ['followers']
        });

        const userResponseTransform = plainToInstance(
            UserProfileResponse,
            {
                ...userSaved,
                following: userFollow ? true : false
            },
            { excludeExtraneousValues: true }
        );

        return userResponseTransform;
    }

    async detail(header: any): Promise<User> {
        if (!header.authorization) {
            throw new Error('Authentication failed');
        }

        const headerToken = header.authorization;
        const result = this.authService.validateToken(headerToken);

        return await this.userRepository.findOneBy({ id: result.sub });
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

    async follow(header: any, username: string): Promise<UserProfileResponse> {
        const userSaved = await this.detail(header);

        if (userSaved.userName === username) {
            throw new Error('You can not follow yourself');
        }

        const userToFollow = await this.userRepository.findOne({
            where: {
                id: userSaved.id,
                // TODO: cho nay bi nguoc
                // check username followed already

                // following: {
                //     followee: {
                //         userName: username,
                //     },
                // }
                following: {
                    followee: {
                        userName: username
                    }
                }
            },
            relations: {
                following: true,
            },
        });

        if (userToFollow) {
            throw new Error('User followed');
        }

        const followee = await this.userRepository.findOne({
            where: {
                userName: username,
            },
        });

        if (!followee) {
            throw new Error('User not found');
        }

        const newFollow = new UserFollow();
        newFollow.follower = userSaved;
        newFollow.followee = followee;

        await this.userFollowRepository.save(newFollow);

        const profile: UserProfileResponse = {
            username: followee.userName,
            bio: followee.bio,
            image: followee.image,
            following: true,
        }

        return profile;
    }

    async unfollow(header: any, username: string): Promise<UserProfileResponse> {
        const userSaved = await this.detail(header);

        if (userSaved.userName === username) {
            throw new Error('You can not unfollow yourself');
        }

        const userToUnfollow = await this.userRepository.findOne({
            where: {
                id: userSaved.id,
                following: {
                    followee: {
                        userName: username
                    }
                }
            },
            relations: {
                following: true,
            },
        });

        if (!userToUnfollow) {
            throw new Error("You can't unfollow a user didn't follow");
        }

        const follower = await this.userRepository.findOne({
            where: {
                userName: username,
            },
        });

        if (!follower) {
            throw new Error('User not found');
        }

        await this.userFollowRepository.delete({
            followerId: userSaved.id,
            followeeId: follower.id,
        });

        const profile: UserProfileResponse = {
            username: follower.userName,
            bio: follower.bio,
            image: follower.image,
            following: false,
        }

        return profile;
    }
}

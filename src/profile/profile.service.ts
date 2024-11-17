import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/users/auth.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';

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
}

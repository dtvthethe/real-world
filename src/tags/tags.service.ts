import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
    constructor (
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>
    ) {}

    findAll(): Promise<Tag[]> {
        return this.tagRepository.find();
    }

    async findAllNames(): Promise<string[]> {
        const tags: Tag[] = await this.tagRepository.find();

        return tags.map(tag => tag.name);
    }
}

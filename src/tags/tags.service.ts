import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>
    ) { }

    async findAllNames(): Promise<string[]> {
        const tags = await this.tagRepository.find();

        return tags.map(tag => tag.name);
    }

    async saveMultipleTag(tagNames: string[]): Promise<Tag[]> {
        let tags: Array<Tag> = [];
        const newTags = [];
        const currentTags = await this.tagRepository.findBy({
            name: In(tagNames)
        });
        tagNames.forEach(tagName => {
            const tag = currentTags.find(tag => tag.name == tagName);

            if (tag) {
                tags.push(tag);
            } else {
                const newTag = new Tag();
                newTag.name = tagName;
                newTags.push(newTag);
            }
        });

        if (newTags) {
            const tagsCreated = this.tagRepository.create(newTags);
            const result = await this.tagRepository.save(tagsCreated);
            tags = [...tags, ...result];
        }

        return tags;
    }
}

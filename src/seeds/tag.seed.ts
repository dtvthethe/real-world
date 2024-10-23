import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "src/tag/tag.entity";
import { Repository } from "typeorm";

export class TagSeed {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepositoty: Repository<Tag>
  ) {}

  async seed() {
    const tags = [
      {
        name: "c#",
      },
      {
        name: "js"
      }
    ];

    await this.tagRepositoty.save(tags); 
  }
}

import { Article } from 'src/article/article.entity';
import { Tag } from 'src/tag/tag.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'article_tags' })
export class ArticleTag {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Article, (article) => article.articleTags)
  @JoinColumn({ name: 'article_id' })
  article!: Article;

  @ManyToOne(() => Tag, (tag) => tag.tagArticles)
  @JoinColumn({ name: 'tag_id' })
  tag!: Tag;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deleteDate?: Date;
}

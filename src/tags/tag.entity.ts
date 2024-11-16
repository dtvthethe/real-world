import { Expose } from 'class-transformer';
import { Article } from 'src/articles/article.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, Index } from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Expose()
  @Column({ unique: true })
  name!: string;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date', nullable: true })
  deleteDate?: Date;

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];
}

import { Article } from 'src/articles/article.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany } from 'typeorm';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120, unique: true, nullable: false })
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

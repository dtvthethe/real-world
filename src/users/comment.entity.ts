import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Article } from "src/articles/article.entity";

@Entity({ name: "comments" })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body!: string;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date', nullable: true })
  deleteDate?: Date;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn({ name: "article_id" })
  article: Article;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "author_id" })
  author: User;
}

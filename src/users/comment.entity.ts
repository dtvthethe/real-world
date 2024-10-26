import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Article } from "src/articles/article.entity";

@Entity({ name: "favorites" })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn({ name: "author_id" })
  author: User;
 
  @ManyToOne(() => Article, (article) => article.comment)
  @JoinColumn({ name: "article_id" })
  article: Article;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deleteDate?: Date;
}

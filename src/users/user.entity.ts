import { Article } from 'src/articles/article.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { Comment } from './comment.entity';
import { UserFollow } from './user_follow.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'username', unique: true })
  userName!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ default: false })
  demo: boolean;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date', nullable: true })
  deleteDate?: Date;

  @OneToMany(() => Article, (article) => article.author)
  articles?: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments?: Comment[];

  @ManyToMany(() => Article, (article) => article.userFavorites)
  articleFavorites?: Article[];

  @OneToMany(() => UserFollow, (userFollows) => userFollows.follower)
  following: UserFollow[];

  @OneToMany(() => UserFollow, (userFollows) => userFollows.followee)
  followers: UserFollow[];
}

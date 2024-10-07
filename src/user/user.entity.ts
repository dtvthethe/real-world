import { Article } from 'src/article/article.entity';
import { Comment } from 'src/comment/comment.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({ name: 'user_name', type: 'varchar', length: 120, unique: true, nullable: false })
  userName!: string;

  @Column()
  password!: string;

  @Column()
  bio?: string;

  @Column()
  image?: string;

  @Column({ name: 'access_token' })
  accessToken?: string;

  @Column({ name: 'refresh_token' })
  refreshToken?: string;

  @Column({ name: 'last_login_date' })
  lastLoginDate?: Date;

  @Column({ name: 'refresh_token_expiry' })
  refreshTokenExpiry?: Date;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deleteDate?: Date;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}

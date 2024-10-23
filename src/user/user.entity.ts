import { Article } from 'src/article/article.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column({ name: 'username', type: 'varchar', length: 120, unique: true, nullable: false })
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

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deleteDate?: Date;

  @ManyToOne(() => Article, (article) => article.author)
  articles?: Article[];
}

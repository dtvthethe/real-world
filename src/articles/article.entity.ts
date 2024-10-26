import { Tag } from 'src/tags/tag.entity';
import { Comment } from 'src/users/comment.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column()
  slug!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  body!: string;

  @Column({ name: 'favorites_count', default: 0 })
  favoritesCount!: number;

  @CreateDateColumn({ name: 'created_date' })
  createdDate!: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate!: Date;

  @DeleteDateColumn({ name: 'deleted_date' })
  deleteDate?: Date;

  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: "article_tags",
    joinColumn: {
      name: "article_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "tag_id",
      referencedColumnName: "id"
    }
  }) // chỉ đc set ở table chủ
  tags?: Tag[];

  @ManyToMany(() => User, (user) => user.articleFavorites)
  @JoinTable({
    name: "article_users",
    joinColumn: {
      name: "article_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    }
  })
  userFavorites?: User[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comment?: Comment[];
}

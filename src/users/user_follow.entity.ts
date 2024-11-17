import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: "user_follows" })
export class UserFollow {
  @PrimaryColumn({ name: 'follower_id' })
  followerId: number;

  @PrimaryColumn({ name: 'followee_id' })
  followeeId: number;

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "follower_id" })
  follower: User; // fans

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "followee_id" })
  followee: User; // idol
}
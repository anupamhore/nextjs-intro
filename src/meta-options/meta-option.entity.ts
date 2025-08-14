import { Post } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  /**
   * This is the case where we want to have a
   * Bi-Directional One-to-One relationship
   * In the @OnetoOne() ->
   *   the first parameter is a function which represent the relation of any entity.
   *   in our case it is the post
   *
   *   the second parameter is again a function which represent the inverse relationship
   *   meaning, in the post entity we must have the metaOptions present, so here the second
   *  parameter is function which takes the "post" entity as argument, and then tells which property
   *  of the post is metaOptions. SO this signifies the inverse relationship and hence
   *  create a bi-directional one-to-one relation
   *
   *  Same we need to do in the post entity as well.
   */
  @OneToOne(() => Post, (post) => post.metaOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  post: Post;
}

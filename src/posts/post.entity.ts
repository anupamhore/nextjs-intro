import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postType } from './enums/postType.enum';
import { postStatus } from './enums/postStatus.enum';
// import { CreatePostMetaOptionsDto } from '../meta-options/dtos/create-post-metaoptions.dto';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp', //'datetime' for mysql
    nullable: true,
  })
  publishOn?: Date;

  /**
   * This is the case where we want to have a
   * Bi-Directional One-to-One relationship
   * In the @OnetoOne() ->
   *   the first parameter is a function which represent the relation of any entity.
   *   in our case it is the metaOptions
   *
   *   the second parameter is again a function which represent the inverse relationship
   *   meaning, in the metaOptions entity we must have the "post" present, so here the second
   *  parameter is function which takes the "metaOptions" entity as argument, and then tells which property
   *  of the metaOptions is post. So this signifies the inverse relationship and hence
   *  create a bi-directional one-to-one relation
   *
   *  Same we need to do in the metaOptions entity as well.
   *
   *  One last thing, the foreign key is still the metaOptions and recides here in the post entity.
   */
  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    /*
      we can insert the metaOptions entity together with post entity if cascade is set to true.
      or else we will first need to create the metaOptions entity, save it and then can create
      post entity. Rather than this, if we use cascade, both these jobs can be done automatically
      by just creating the post and saving it
    */
    cascade: true, //['remove','insert]

    /**
      when we try to fetch data from the post entity and it has one to one relations or one to many relations
      by default, only the elements in post entity is fetched. To include the other relational entities data
      we need to specifically mention the "relations" object and set the entity to "true" then only it will 
      be fetched along with the post entity

      But if we set the "eager" property as "true", then it will automatically fetch the relational entity properties
     */
    eager: true,
  })
  // @JoinColumn()
  metaOptions?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
  })
  author: User;

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    eager: true,
  })
  @JoinTable()
  tags?: Tag[];
}

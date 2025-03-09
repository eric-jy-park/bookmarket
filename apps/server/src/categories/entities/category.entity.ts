import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.category)
  bookmarks: Bookmark[];
}

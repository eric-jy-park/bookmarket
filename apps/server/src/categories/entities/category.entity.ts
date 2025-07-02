import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Bookmark } from '../../bookmarks/entities/bookmark.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  @Unique(['name', 'user'])
  name: string;

  @ManyToOne(() => User, user => user.categories, { eager: true })
  user: User;

  @OneToMany(() => Bookmark, bookmark => bookmark.category, {
    cascade: true,
  })
  bookmarks: Bookmark[];
}

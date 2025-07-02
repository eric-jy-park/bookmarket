import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Bookmark extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  faviconUrl?: string;

  @ManyToOne(() => User, user => user.bookmarks, { eager: true })
  user: User;

  @ManyToOne(() => Category, category => category.bookmarks, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  category?: Category;
}

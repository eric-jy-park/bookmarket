import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AuthProvider } from '../enums/auth-provider.enum';
import { Bookmark } from 'src/bookmarks/entities/bookmark.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ enum: AuthProvider })
  auth_provider: AuthProvider;

  @Column({ nullable: true })
  google_id?: string;

  @Column({ nullable: true })
  github_id?: string;

  @Column({ nullable: true })
  picture?: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];
}

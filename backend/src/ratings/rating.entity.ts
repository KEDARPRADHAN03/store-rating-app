import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Store } from '../stores/store.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => Store, (store) => store.ratings)
  store: Store;
}
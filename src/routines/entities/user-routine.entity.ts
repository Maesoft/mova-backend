import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Routine } from './routine.entity';

@Unique(['user', 'routine'])
@Entity()
export class UserRoutine {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userRoutines, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Routine, {
    onDelete: 'CASCADE',
  })
  routine!: Routine;

  @Column({ default: 1 })
  currentDay!: number;

  @Column({ default: false })
  completed!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt!: Date | null;
}

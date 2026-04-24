import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Routine } from './routine.entity';

@Entity()
@Unique(['user', 'routine'])
export class UserRoutine {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Routine, { eager: true, onDelete: 'CASCADE' })
  routine!: Routine;

  @Column({ default: false })
  isActive!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt!: Date;

  @Column({ default: 1 })
  currentDay!: number;

  @Column({ type: 'timestamp', nullable: true })
  lastCompletedAt?: Date;
}

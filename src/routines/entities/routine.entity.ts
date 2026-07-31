import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { RoutineDay } from './routine-day.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.createdRoutines, {
    onDelete: 'CASCADE',
  })
  trainer!: User;

  @OneToMany(() => RoutineDay, (day) => day.routine, {
    cascade: true,
    eager: true,
  })
  days!: RoutineDay[];

  @Column({ default: false })
  isChallenger!: boolean;
}

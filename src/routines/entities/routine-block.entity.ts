import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { RoutineDay } from './routine-day.entity';
import { RoutineExercise } from './routine-exercise.entity';

@Entity()
export class RoutineBlock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  order!: number;

  @ManyToOne(() => RoutineDay, (day) => day.blocks, {
    onDelete: 'CASCADE',
  })
  day!: RoutineDay;

  @OneToMany(() => RoutineExercise, (exercise) => exercise.block, {
    cascade: true,
    eager: true,
  })
  exercises!: RoutineExercise[];
}

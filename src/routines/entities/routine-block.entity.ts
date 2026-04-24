import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Routine } from './routine.entity';
import { RoutineBlockExercise } from './routine-block-exercise.entity';

@Entity()
export class RoutineBlock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  order!: number;

  @Column()
  day!: number;

  @ManyToOne(() => Routine, (routine) => routine.blocks, {
    onDelete: 'CASCADE',
  })
  routine!: Routine;

  @OneToMany(() => RoutineBlockExercise, (ex) => ex.block, {
    cascade: true,
  })
  exercises!: RoutineBlockExercise[];
}

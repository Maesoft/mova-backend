import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { RoutineBlock } from './routine-block.entity';
import { Exercise } from '../../exercises/exercise.entity';

@Entity()
export class RoutineExercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => RoutineBlock, (block) => block.exercises, {
    onDelete: 'CASCADE',
  })
  block!: RoutineBlock;

  @ManyToOne(() => Exercise, {
    eager: true,
    onDelete: 'CASCADE',
  })
  exercise!: Exercise;

  @Column({
    type: 'text',
    default: '',
  })
  instructions!: string;

  @Column()
  order!: number;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { RoutineBlock } from './routine-block.entity';
import { Exercise } from '../../exercises/exercise.entity';

@Entity()
export class RoutineBlockExercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => RoutineBlock, (block) => block.exercises, {
    onDelete: 'CASCADE',
  })
  block!: RoutineBlock;

  @ManyToOne(() => Exercise, {
    eager: true, // te trae el ejercicio automáticamente
  })
  exercise!: Exercise;

  @Column()
  sets!: number;

  @Column()
  reps!: number;

  @Column({ nullable: true })
  restSeconds?: number;

  @Column()
  order!: number;
}

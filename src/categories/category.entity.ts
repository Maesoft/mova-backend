import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exercise } from '../exercises/exercise.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Exercise, (exercise) => exercise.category)
  exercises!: Exercise[];
}

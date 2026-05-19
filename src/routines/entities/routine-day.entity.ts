import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Routine } from './routine.entity';
import { RoutineBlock } from './routine-block.entity';

@Entity()
export class RoutineDay {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  dayNumber!: number;

  @ManyToOne(() => Routine, (routine) => routine.days, {
    onDelete: 'CASCADE',
  })
  routine!: Routine;

  @OneToMany(() => RoutineBlock, (block) => block.day, {
    cascade: true,
    eager: true,
  })
  blocks!: RoutineBlock[];
}

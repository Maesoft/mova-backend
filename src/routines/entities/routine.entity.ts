import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RoutineBlock } from './routine-block.entity';
import { User } from '../../users/user.entity';

@Entity()
export class Routine {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  // 👨‍🏫 Entrenador que la crea
  @ManyToOne(() => User, (user) => user.createdRoutines, {
    eager: true,
  })
  trainer!: User;

  // 👥 Usuarios asignados
  @ManyToMany(() => User, (user) => user.assignedRoutines)
  @JoinTable()
  assignedTo!: User[];

  @OneToMany(() => RoutineBlock, (block) => block.routine, {
    cascade: true,
  })
  blocks!: RoutineBlock[];
}

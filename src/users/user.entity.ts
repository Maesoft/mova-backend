import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Routine } from '../routines/entities/routine.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 'user' })
  role!: string;

  // 👨‍🏫 Rutinas creadas como entrenador
  @OneToMany(() => Routine, (routine) => routine.trainer)
  createdRoutines!: Routine[];

  // 🧍 Rutinas asignadas a este usuario
  @ManyToMany(() => Routine, (routine) => routine.assignedTo)
  assignedRoutines!: Routine[];
}

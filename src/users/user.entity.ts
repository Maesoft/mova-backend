import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Routine } from '../routines/entities/routine.entity';
import { UserRoutine } from '../routines/entities/user-routine.entity';

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

  // 🧍 Relación con rutinas (con estado, progreso, etc)
  @OneToMany(() => UserRoutine, (ur) => ur.user)
  userRoutines!: UserRoutine[];
}

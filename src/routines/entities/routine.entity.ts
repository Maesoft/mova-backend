import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { RoutineBlock } from './routine-block.entity';
import { User } from '../../users/user.entity';
import { UserRoutine } from './user-routine.entity';

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

  // 🔥 Relación real con usuarios (con estado)
  @OneToMany(() => UserRoutine, (ur) => ur.routine)
  userRoutines!: UserRoutine[];

  @OneToMany(() => RoutineBlock, (block) => block.routine, {
    cascade: true,
  })
  blocks!: RoutineBlock[];
}

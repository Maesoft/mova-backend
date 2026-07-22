import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Routine } from '../../routines/entities/routine.entity';

@Entity()
export class Challenger {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Routine)
  @JoinColumn()
  routine!: Routine;

  @Column({ default: false })
  published!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

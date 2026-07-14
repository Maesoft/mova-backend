import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ChallengerDay } from './challenger-day.entity';

@Entity()
export class Challenger {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  name!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column({ nullable: true })
  image!: string;

  @Column({ default: false })
  published!: boolean;

  @OneToMany(() => ChallengerDay, (day) => day.challenger, {
    cascade: true,
  })
  days!: ChallengerDay[];

  @CreateDateColumn()
  createdAt!: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Challenger } from './challenger.entity';

@Entity()
export class ChallengerDay {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Challenger, (challenger) => challenger.days, {
    onDelete: 'CASCADE',
  })
  challenger!: Challenger;

  @Column()
  dayNumber!: number;

  @Column({ length: 150 })
  title!: string;

  @Column('text')
  description!: string;

  @Column({ nullable: true })
  videoUrl!: string;

  @Column({ nullable: true })
  image!: string;
}

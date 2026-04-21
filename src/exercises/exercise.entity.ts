import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @ManyToOne(() => Category, (category) => category.exercises, {
    eager: true, // 🔥 te trae la categoría automáticamente
  })
  category!: Category;
}

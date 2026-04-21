// users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ✅ Crear usuario (register)
  async create(data: Partial<User>): Promise<User> {
    if (!data.email) {
      throw new BadRequestException('El email es requerido');
    }

    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }
    data.email = data.email.toLowerCase();
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  // ✅ Buscar por email (login)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // ✅ Buscar por id (para JWT)
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  // ✅ Obtener todos (admin dashboard)
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // ✅ Activar / desactivar usuario (gym lógica)
  async toggleActive(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    user.isActive = !user.isActive;

    return this.userRepository.save(user);
  }

  // ✅ Eliminar usuario
  async delete(id: number) {
    const user = await this.findById(id);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return this.userRepository.remove(user);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData); // Cria uma nova instância de User
    return this.userRepository.save(user); // Salva o usuário e retorna o resultado
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id); // Retorna o usuário atualizado
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user); // Remove o usuário
    return user; // Retorna o usuário removido
  }
}

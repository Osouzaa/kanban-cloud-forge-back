import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });

      if (existingUser) {
        throw new ConflictException('E-mail já está em uso.');
      }
      const password_hash = await hash(createUserDto.password, 8)

      const newUser = this.usersRepository.create({
        ...createUserDto,
        password_hash
      });

      await this.usersRepository.save(newUser);

      return newUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Erro ao criar usuário.');
      }
    }
  }

  async findAll() {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar usuários.');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao buscar usuário.');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      Object.assign(user, updateUserDto);
      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Erro ao atualizar usuário.');
      }
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);
      await this.usersRepository.remove(user);
      return { message: `Usuário com ID ${id} foi removido com sucesso.` };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Erro ao remover usuário.');
      }
    }
  }
}

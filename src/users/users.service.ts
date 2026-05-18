import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { DatabaseService } from 'src/database/database.service';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingServiceProtocol: HashingServiceProtocol,
  ) {}

  async findOne(id: number) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          tasks: true,
        },
      });

      if (user) return user;
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    } catch (err) {
      throw new HttpException(
        'Failed to find user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingServiceProtocol.hash(
        createUserDto.password,
      );

      const newUser = await this.databaseService.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return newUser;
    } catch (err) {
      throw new HttpException(
        'failed to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const findUser = await this.databaseService.user.findUnique({
        where: { id },
      });

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      let passwordHash = await this.criptoPassword(updateUserDto.password, findUser.passwordHash)

      let name = this.ajustName(updateUserDto.name, findUser.name);

      const updateUser = await this.databaseService.user.update({
        where: { id },
        data: {
          name,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      return updateUser;
    } catch (err) {
      throw new HttpException(
        'Failed to updated user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number) {
    try {
      const findUser = await this.databaseService.user.findUnique({
        where: { id },
      });

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      await this.databaseService.user.delete({
        where: { id },
      });

      return { message: 'User deleted successfully' };
    } catch (err) {
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async criptoPassword(password: string | undefined, passwordHash: string): Promise<string> {
    return password ? await this.hashingServiceProtocol.hash(password) : passwordHash;
  }

  ajustName(name: string | undefined, oldname: string): string {
    return name ? name : oldname;
  }
}

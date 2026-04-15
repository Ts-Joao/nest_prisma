import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create.task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update.task.dto';
import { DatabaseService } from 'src/database/database.service';
import { PaginationDto } from './../common/dto/pagination.dto';
import { resolvePagination } from 'src/common/pagination/resolvePagination';

@Injectable()
export class TasksService {
  constructor(private readonly databaseService: DatabaseService) {}

  async listAllTasks(paginationDto: PaginationDto) {
    const { limit, offset } = resolvePagination(paginationDto);

    try {
      const allTasks = await this.databaseService.task.findMany({
        take: limit,
        skip: offset,
      });
      return allTasks;
    } catch (error) {
      throw new HttpException(
        'Erro ao listar as tarefas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async FindOneTask(id: number) {
    try {
      const task = await this.databaseService.task.findUnique({
        where: { id },
      })

      if (!task) {
        throw new HttpException('Tarefa não encontrada',
          HttpStatus.NOT_FOUND);
      }

      return task
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Erro ao buscar tarefa por ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTask = await this.databaseService.task.create({
        data: {
          name: createTaskDto.name,
          description: createTaskDto.description,
        },
      });
      return newTask;
    } catch (error) {}
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const findTask = await this.databaseService.task.findUnique({
        where: { id },
      });
      if (!findTask) {
        throw new NotFoundException('Tarefa nao encontrada');
      }

      const updateTask = await this.databaseService.task.update({
        where: { id },
        data: updateTaskDto,
      });
      return updateTask;
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar a tarefa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTask(id: number) {
    try {
      const findTask = await this.databaseService.task.findUnique({
        where: { id },
      });
      if (!findTask) {
        throw new NotFoundException('Tarefa nao encontrada');
      }

      await this.databaseService.task.delete({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(
        'Erro ao deletar a tarefa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

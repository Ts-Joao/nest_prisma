import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from 'src/tasks/dto/create.task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update.task.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TasksService {
	constructor(private readonly databaseService: DatabaseService) {}

    async listAllTasks() {
		try {
			const allTasks = await this.databaseService.task.findMany()
			return allTasks
		} catch (error) {
			throw new HttpException(
				"Erro ao listar as tarefas",
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
    }

    async FindOneTask(id : number) {
		try {			
			const task = this.databaseService.task.findUnique({
				where: { id }
			});

			return task
		} catch (error) {
			throw new HttpException(
				"Erro ao buscar tarefa por ID",
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
    }

    async create(createTaskDto: CreateTaskDto) {
        try {
			const newTask  = await this.databaseService.task.create({
				data: {
					name: createTaskDto.name,
					description: createTaskDto.description
				}
			})
		} catch (error) {
			
		}
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
		try {
			const findTask = await this.databaseService.task.findUnique({
				where: { id }
			})
			if (!findTask) {
				throw new NotFoundException("Tarefa nao encontrada")
			}

			const updateTask = await this.databaseService.task.update({
				where: { id },
				data: updateTaskDto
			})
			return updateTask
		} catch (error) {
			throw new HttpException(
				"Erro ao atualizar a tarefa",
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
    }

    async deleteTask(id: number) {	
		try {
			const findTask = await this.databaseService.task.findUnique({
				where: { id }
			})
			if (!findTask) {
				throw new NotFoundException("Tarefa nao encontrada")
			}

			await this.databaseService.task.delete({
				where: { id }
			})
		} catch (error) {
			throw new HttpException(
				"Erro ao deletar a tarefa",
				HttpStatus.INTERNAL_SERVER_ERROR
			)
		}
    }
}
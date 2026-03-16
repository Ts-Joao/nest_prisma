import { Controller, Get, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly TasksService: TasksService) {}
    @Get()
    getTasks() {
        return this.TasksService.listAllTasks();
    }

    @Get('/busca')
    findTaskByQuery(@Query() queryParams: any) {
        return this.TasksService.listAllTasks()
    }

    @Get(':id')
    findTaskById(@Param('id') id: string) {
        return this.TasksService.FindOneTask(id);
    }
}

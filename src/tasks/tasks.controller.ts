import { CreateTaskDto } from 'src/dto/create.task.dto';
import { TasksService } from './tasks.service';
import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query 
} from '@nestjs/common';
import { UpdateTaskDto } from 'src/dto/update.task.dto';
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

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.TasksService.create(createTaskDto)
    }

    @Put(':id')
    updateTask(@Param('id') id:string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.TasksService.update(id, updateTaskDto)
    }

    @Delete('id')
    deleteTask(@Param('id') id: string) {
        return this.TasksService.deleteTask(id)
    }
}

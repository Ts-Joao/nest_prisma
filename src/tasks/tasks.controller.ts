import { CreateTaskDto } from 'src/tasks/dto/create.task.dto';
import { TasksService } from './tasks.service';
import { 
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query, 
    UseInterceptors
} from '@nestjs/common';
import { UpdateTaskDto } from 'src/tasks/dto/update.task.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LoggerInterceptor } from 'src/common/interceptors/logger.interceptor';
import { BodyCreaeteTaskInterceptor } from 'src/common/interceptors/body-create.task.interceptor';
import { AddHeaderInterceptor } from 'src/common/interceptors/add-header.interceptor';

@Controller('tasks')
export class TasksController {
    constructor(private readonly TasksService: TasksService) {}

    @Get()
    @UseInterceptors(LoggerInterceptor)
    @UseInterceptors(AddHeaderInterceptor)
    getTasks(@Query() paginationDto: PaginationDto) {
        console.log(paginationDto)
        return this.TasksService.listAllTasks(paginationDto);
    }

    @Get('/busca')
    findTaskByQuery(@Query() paginationDto: PaginationDto) {
        return this.TasksService.listAllTasks(paginationDto)
    }

    @Get(':id')
    findTaskById(@Param('id', ParseIntPipe) id: number) {
        return this.TasksService.FindOneTask(id);
    }

    @Post()
    @UseInterceptors(LoggerInterceptor)
    @UseInterceptors(BodyCreaeteTaskInterceptor)
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.TasksService.create(createTaskDto)
    }

    @Put(':id')
    updateTask(@Param('id', ParseIntPipe) id:number, @Body() updateTaskDto: UpdateTaskDto) {
        return this.TasksService.update(id, updateTaskDto)
    }

    @Delete('id')
    deleteTask(@Param('id', ParseIntPipe) id: number) {
        return this.TasksService.deleteTask(id)
    }
}

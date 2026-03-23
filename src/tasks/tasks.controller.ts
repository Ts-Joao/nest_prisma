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
    createTask(@Body() body:any) {
        return this.TasksService.create(body)
    }

    @Put(':id')
    updateTask(@Param('id') id:string, @Body() body: any) {
        return this.TasksService.update(id, body)
    }

    @Delete('id')
    deleteTask(@Param('id') id: string) {
        return this.TasksService.deleteTask(id)
    }
}

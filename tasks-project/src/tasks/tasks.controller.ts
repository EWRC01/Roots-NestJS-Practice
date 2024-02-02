import { Body, Controller, Delete, Get, Param, Post, Put, Patch } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getAllTasks() {
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() newTask: CreateTaskDto) {
    return this.tasksService.createTask(newTask.title, newTask.description);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string) {
    this.tasksService.deleteTask(id)
    return 'Elemento Eliminado con Exito!'
  }

  @Patch(":id")
  updateTask(@Param("id") id: string, @Body() updateFields: UpdateTaskDto){
    return this.tasksService.updateTask(id, updateFields)
  }

  @Get(":id")
  getTaskByID(@Param('id') id: string) {
    return this.tasksService.getTaskByID(id);
  }
}

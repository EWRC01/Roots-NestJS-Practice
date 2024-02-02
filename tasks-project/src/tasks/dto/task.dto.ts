
import { TaskStatus } from "../task.entity"
import {IsIn, IsNotEmpty, IsOptional, IsString, MinLength} from 'class-validator'

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    description: string;
}

export class UpdateTaskDto {

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    @IsIn([TaskStatus.PENDING, TaskStatus.DONE, TaskStatus.IN_PROGRESS])
    status?: TaskStatus;
}
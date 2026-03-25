import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator"



export class UpdateTaskDto {
    @IsOptional()
    @IsString({ message: 'Name msut be a string' })
    @MinLength(5, { message: 'Name must be a string' })
    readonly name?: string

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    readonly description?: string

    @IsOptional()
    @IsBoolean()
    readonly completed?: boolean
}
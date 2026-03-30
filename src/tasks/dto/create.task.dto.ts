import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateTaskDto {
    @IsString({ message: 'Name must be a string' })
    @MinLength(5, { message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    readonly name: string

    @IsString({ message: 'Description must be a string' })
    @MinLength(10, { message: 'Description must be at least 10 characters long' })
    readonly description: string
}
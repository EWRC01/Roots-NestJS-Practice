import { IsNotEmpty, IsString, Length, MinLength, max, min } from 'class-validator'

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstname: string;

    @IsString()
    lastname ?: string;

    @IsString()
    @IsNotEmpty()
    username: string;
    
    @MinLength(8)
    @IsNotEmpty()
    password: string;
}


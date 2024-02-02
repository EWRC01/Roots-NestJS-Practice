import { IsOptional, IsString, MinLength} from 'class-validator'

export class UpdateUserDto {
    
    @IsString()
    @IsOptional()
    firstname?:string;

    @IsString()
    @IsOptional()
    lastname?:string;

    @IsString()
    @IsOptional()
    username?:string;
    
    @MinLength(8)
    @IsOptional()
    password?:string;
}


import { PartialType } from "@nestjs/swagger";
import { LoginAuthDto } from "./login-auth.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterAuthDto extends PartialType(LoginAuthDto) {

    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsOptional()
    lastname: string;
}
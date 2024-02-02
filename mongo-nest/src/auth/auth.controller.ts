import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    //Todo register

    @Post('register')
    registerUser(@Body() userObject: RegisterAuthDto) {
        return this.authService.register(userObject)
    }

    //Todo Login

    @Post('login')
    loginUser(@Body() userObject: LoginAuthDto) {
       return this.authService.login(userObject)
    }
}

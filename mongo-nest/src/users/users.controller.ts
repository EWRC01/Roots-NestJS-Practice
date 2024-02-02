import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAllUsers(){
        return this.usersService.findAllUsers();
    }

    @Get(':userId')
    findOneUser(@Param('userId') userId: string){
        return this.usersService.findOneUser(userId);
    }

    @Delete(':userId')
    deleteUser(@Param('userId') userId: string){
        return this.usersService.deleteUser(userId);
    }

    @Patch(':userId')
    updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.updateUser(userId, updateUserDto);
    }
}

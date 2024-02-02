import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(Users.name) private usersModule:Model<UsersDocument>,
    ){}

    createUser(createUserDto: CreateUserDto) {
        return 'This action create a new user';
    }

    findAllUsers() {
        return 'This action return all users';
    }

    findOneUser(id: number) {
        return 'This action find one user by ID';
    }

    deleteUser(id: number) {
        return 'This action delete an user by ID';
    }

    
}

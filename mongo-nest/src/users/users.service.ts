import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectModel(Users.name) private usersModule:Model<UsersDocument>,
    ){}

    async createUser(createUserDto: CreateUserDto) {

        const userCreated = this.usersModule.create(createUserDto)
        return userCreated;
    }

    findAllUsers() {
        const listUsers = this.usersModule.find();
        return listUsers;
    }

    async findOneUser(userId: string) {
        const existsUser = await this.usersModule.findById(userId).exec();

        if (!existsUser) {
            return new HttpException(`User: ${userId} not found!`, HttpStatus.NOT_FOUND);
        }
        return existsUser;

    }

    async deleteUser(userId: string) {

        const existsUser = await this.usersModule.findByIdAndDelete(userId);

        if(!existsUser) {
            throw new HttpException(`The user you want to delete not Found!`, HttpStatus.NOT_FOUND);
        }
        return existsUser;   
    }

    async updateUser(userId: string, user: UpdateUserDto) {
        const existsUser  = await this.usersModule.findByIdAndUpdate(userId, user,{new:true} );

        if (!existsUser) {
            throw new HttpException(`User: ${userId} not found!`, HttpStatus.NOT_FOUND);
        }

        return existsUser;
        
        
    }

    
}

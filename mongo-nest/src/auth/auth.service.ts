import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { UsersService } from 'src/users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {hash, compare} from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Users.name) private readonly userModel: Model<UsersDocument>,
        private jwtService:JwtService
    ) {}

    async register(userObject:RegisterAuthDto) {

        const { password } = userObject;
        const plainToHash =  await hash(password, 10);
        userObject = {...userObject, password:plainToHash};
        return this.userModel.create(userObject);

    }

    async login(userObjectLogin:LoginAuthDto){
        const {username, password} = userObjectLogin
        const findUser = await this.userModel.findOne({username})

        if(!findUser) {
            throw new HttpException(`User ${username} not found!`, HttpStatus.NOT_FOUND)
        }

        const checkPassword = await compare(password, findUser.password);

        if(!checkPassword) {
            throw new HttpException('Password Incorrect!', HttpStatus.FORBIDDEN);

        }


        const payload = {id: findUser._id, name: findUser.firstname};
        const token = this.jwtService.sign(payload);

        const data = {
            user:findUser,
            token,
        };

        return data;



    }

}

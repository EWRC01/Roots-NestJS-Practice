## Instalación:

```javascript
npm install -g @nestjs/cli
```


## Creación de nuevo proyecto:

```javascript
nest new task-project
```

### Instalacion de paquetes necesarios:

```js
npm install --save @nestjs/typeorm typeorm mysql2
```

### Inclusion de los paquetes en el app.module.ts:

```js
import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';

import {TypeOrmModule} from '@nestjs/typeorm'

  

@Module({

  imports: [TypeOrmModule.forRoot({

    type: 'mysql',

    host: 'localhost',

    port: 3306,

    username: 'root',

    password: 'usbw',

    database: 'users-test',

    entities: [__dirname + '/**/*.entity{.ts,.js}'],

    synchronize: true,

  

  }),

  UsersModule],

  controllers: [],

  providers: [],

})

export class AppModule {}
```


### Creacion de una entidad para la base de datos:

user.entity.ts:

```ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

  

@Entity({name: 'users'})

export class User {

  

    @PrimaryGeneratedColumn()

    id: number

  

    @Column({unique: true})

    username: string

  

    @Column()

    password: string

  

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})

    createdAt: Date

  

    @Column({nullable: true})

    authStrategy: string

}
```

### Creacion de un usuario

Primeramente instanciamos la entidad creada anteriormente para poder acceder a ella.

`users.service.ts`

```ts
import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';

  

@Injectable()

export class UsersService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  

    createUser(user: CreateUserDto){

        const newUser = this.userRepository.create(user)

        return  this.userRepository.save(newUser)

    }

  

}
```


Del lado del controlador, indicamos que a traves de una peticion POST, llegaran los datos e indicamos que vendran inherentes en el body:

`users.controller.ts`

```ts
import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { UsersService } from './users.service';

  

@Controller('users')

export class UsersController {

  

    constructor(private usersService: UsersService) {}

  
  

    @Post()

    createUser(@Body() newUser: CreateUserDto) {

        return this.usersService.createUser(newUser);

    }

}
```

Tambien indicamos que tipo de modulo ORM estamos utilizando:

`users.module.ts`

```ts
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';

  

@Module({

  imports: [TypeOrmModule.forFeature([User])],

  controllers: [UsersController],

  providers: [UsersService]

})

export class UsersModule {}
```

### Obtener Usuarios

Para obtener usuarios, hacemos uso de la funcion find y findOne, respectivamente:

```ts
 getUsers() {

        return this.userRepository.find()

    }

  

    getUser(id: number) {

        return this.userRepository.findOne({where:{

            id

        }})

    }
```

A excepcion de listar solo un usuario que espera como parametro un id, pero lo veremos en los controladores:

```ts
   @Get()

    getUsers(): Promise<User[]> {

        return this.usersService.getUsers();

    }

  

    @Get(':id')

    getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {

        return this.usersService.getUser(id);

    }
```

Se nos facilita un poco la inclusion ya que anteriormente para el POST, ya habiamos declarado el metodo constructor, a su vez en el de obtener un usuario esperamos un number, pero este automaticamente lo da en tipo String, para esto hacemos uso de ParseIntPipe, para que se transforme dicho String a Number y asi no nos de ningun error.

### Eliminar Usuario

Para eliminar un usuario hacemos uso de las funciones del repositorio entre ellas se encuentra la funcion delete, la cual la logica es bastante parecida a la de obtener un usuario por id:

```ts
   deleteUser(id: number) {

       return this.userRepository.delete({ id });

    }
```

Por parte del controlador seria lo siguiente:

```ts
   @Delete(':id')

    deleteUser(@Param('id', ParseIntPipe) id: number) {

        return this.usersService.deleteUser(id);

    }
```

### Actualizar usuario

Para actualizar un usuario, vamos a utilizar el metodo PATCH, debido a que si utilizamos el metodo put tendriamos que cambiar toda la query y es a decision del usuario cambiar parcialmente ciertos datos.

```ts
    updateUser(id: number, user:UpdateUserDto){

        return this.userRepository.update({id}, user)

    }
```

Creamos la funcion, que se espera un id y un DTO, en el que esperamos un Username y un Password y simplemente retornamos dicha respuesta por parte del servidor, a continuacion adjunto el DTO:

```ts
export class UpdateUserDto {

    username?: string

    password?: string

}
```


Y por parte del controlador se seguiria la misma logica recibiendo dos parametros, uno en el body y otro el cual es el id:

```ts
    @Patch(':id')

    updateUser(@Param('id', ParseIntPipe) id:number, @Body() user:UpdateUserDto) {

        return this.usersService.updateUser(id, user);

    }
```


### Validaciones 

#### HttpException | HttpStatus

en el proceso hay librerias que nos pueden facilitar el trabajo, es el caso de las mencionadas anteriormente.

De momento, nuestro proyecto es funcional, pero falta validar los datos ya que los codigos de estado no me dan mucha informacion acerca de el error en especifico.

para esto modificamos el archivo:

`users.services.ts` :

```ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';

import { UpdateUserDto } from './dto/update-user.dto';

  

@Injectable()

export class UsersService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  

    async createUser(user: CreateUserDto){

  
  

        const userFound = await this.userRepository.findOne({

            where: {

                username: user.username

            }

        })

  

        if (userFound) {

            return new HttpException('User already exists', HttpStatus.CONFLICT)

        }

        const newUser = this.userRepository.create(user)

        return  this.userRepository.save(newUser)

    }

  

    async getUsers() {

        const usersFound = await this.userRepository.find()

  

        if (usersFound.length === 0) {

            return new HttpException('Not users registered yet!', HttpStatus.NOT_FOUND);

  

        }

  

        return usersFound;

    }

  

    async getUser(id: number) {

       const userFound = await this.userRepository.findOne({where:{

            id

        }});

  

        if (!userFound) {

            return new HttpException('User not found', HttpStatus.NOT_FOUND);

        }

  

        return userFound;

    }

  

    async deleteUser(id: number) {

       const userFound = await this.userRepository.findOne({ where: {

        id

       } });

  

       if(!userFound) {

        return new HttpException('User not found', HttpStatus.NOT_FOUND)

       }

  

       return this.userRepository.delete({id});

    }

  

    async updateUser(id: number, user:UpdateUserDto){

        const userFound = await this.userRepository.findOne({where: {

            id

        }})

  

        if (!userFound) {

            return new HttpException('User not found', HttpStatus.NOT_FOUND);

        }

  

        const updatedUser = Object.assign(userFound, user);

  

        return this.userRepository.save(updatedUser);

    }

  

}
```

Y a su vez modificamos el archivo de controladores:

`users.controller.ts`:

```ts
import { Body, Controller, Post, Get, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';

import { UsersService } from './users.service';

import { User } from './user.entity';

import { UpdateUserDto } from './dto/update-user.dto';

  

@Controller('users')

export class UsersController {

  

    constructor(private usersService: UsersService) {}

  

    @Get()

    getUsers(){

        return this.usersService.getUsers();

    }

  

    @Get(':id')

    getUser(@Param('id', ParseIntPipe) id: number){

        return this.usersService.getUser(id);

    }

  

    @Post()

    createUser(@Body() newUser: CreateUserDto){

        return this.usersService.createUser(newUser);

    }

  

    @Delete(':id')

    deleteUser(@Param('id', ParseIntPipe) id: number) {

        return this.usersService.deleteUser(id);

    }

  

    @Patch(':id')

    updateUser(@Param('id', ParseIntPipe) id:number, @Body() user:UpdateUserDto) {

        return this.usersService.updateUser(id, user);

    }

  

}
```

### Relacion One to One

Ahorita mismo, tenemos un registro de usuarios, pero si queremos agregarle un perfil a ese usuario, como  lo hariamos?

Bueno aplicariamos la relacion one to one:

En una relación de uno a uno, un registro de una tabla se asocia a uno y solo un registro de otra tabla. Por ejemplo, en una base de datos de un centro educativo, cada alumno tiene solamente un ID de estudiante, y cada ID de estudiante se asigna solo a una persona.

Una relación de uno a uno presenta el siguiente aspecto en el gráfico de relaciones:

Tabla Alumnos y tabla Información de contacto con una relación de uno a uno entre ellas

![[Pasted image 20240201162716.png]]

Para esto podemos crear un perfil por usuario que sera exclusivo de el mismo.

Iniciamos creando una entidad llamada Profile:

```ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

  

@Entity('user_profile')

export class Profile {

    @PrimaryGeneratedColumn()

  

    id: number;

  

    @Column()

    firstname: string;

  

    @Column()

    lastname: string;

  

    @Column({nullable:true})

    age: number;

}
```


Y agregamos a nuestra entidad de usuario una columna con especial atencion a los siguientes parametros:

```ts
@OneToOne(() => Profile)

@JoinColumn()

profile: Profile
```

Luego en nuestro archivo de servicios creamos una funcion llamada createProfile que nos permita insertar datos a un usuario existente en la base de datos por medio del id:

```ts
 async createProfile(id: number, profile: CreateProfileDto) {

       const userFound = await this.userRepository.findOne({

        where: {

            id,

        },

    });

        if (!userFound) {

            return new HttpException('User not found',

            HttpStatus.NOT_FOUND);

        }

  

        const newProfile = this.profileRepository.create(profile)

  

       const savedProfile =  await this.profileRepository.save(newProfile)

  

       userFound.profile = savedProfile

  

        return this.userRepository.save(userFound)

    }
```

A su vez como es costumbre creamos el respectivo DTO para el servicio:

```ts
export class CreateProfileDto{

    firstname: string

    lastname: string

    age?: number

}
```


Y por ultimo lo incluimos en el controlador:

```ts
@Post(':id/profile')

    createProfile(

        @Param('id', ParseIntPipe) id:number,

        @Body() profile: CreateProfileDto

        ) {

        this.usersService.createProfile(id, profile)
    }
```

### Relacion One to Many

Primeramente creamos los archivos necesarios:

```ts
nest g controller posts--no-spec
```

```ts
nest g service posts--no-spec
```

```ts
nest g module posts--no-spec
```


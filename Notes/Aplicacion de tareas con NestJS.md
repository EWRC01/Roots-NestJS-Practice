---
share_link: https://share.note.sx/fmq4qgb0#6dQP6/9PdrOTCGUBtLWdUG68xBJtKysyZtlujeoXFJ8
share_updated: 2024-01-31T13:46:11-06:00
---
## Instalación:

```javascript
npm install -g @nestjs/cli
```


## Creación de nuevo proyecto:

```javascript
nest new task-project
```


### Eliminamos archivos por defecto del proyecto:

dejando unicamente el archivo `app.module.ts` de la siguiente forma:

```javascript
import { Module } from '@nestjs/common';

@Module({

  imports: [],

  controllers: [],

  providers: [],

})

export class AppModule {}
```

### Generando arquitectura del proyecto a traves de consola

Generamos un modulo con el siguiente comando:

```javascript
nest generate module tasks
```

Tambien podemos generar un controlador de la siguiente manera:

```javascript
nest generate controller tasks --no-spec
```

a su vez tambien podemos generar un servicio:

```javascript
nest generate service --no-spec
```


**Nota: la flag `--no-spec` se utiliza para no generar el archivo de testing que genera por defecto tanto en el controlador como en el servicio, generalmente es usado para entornos de produccion, pero como es una aplicacion de prueba no es necesario de momento.**

### Primer hello world con el modulo creado

Si intentamos navegar hacia la ruta que hemos asignado, no nos aparecera nada en un inicio ya que no esta definido, pero vamos a hacer un hello world! bastante sencillo, para esto nos vamos al controlador y agregamos lo siguiente:

```javascript
import { Controller, Get } from '@nestjs/common';

@Controller('tasks')

export class TasksController {

    @Get()

    helloworld() {

        return 'Hello World!';

    }
}
```




A traves de la funcion Get, que importamos desde nestjs/common, podemos definir que es lo que queremos que se muestre cuando se ejecute una peticion Get a nuestro servidor, por lo que simplemente definimos la funcion Hello World, que retorne una cadena de texto.

### Entidades

Una entidad es algo similar a un objeto (programación orientada a objetos) y representa algo en el mundo real, incluso algo abstracto. Tienen atributos que son las cosas que los hacen ser una entidad y por convención se ponen en plural.

Para crear una entidades en NestJS lo hacemos de manera manual:

```javascript
enum taskStatus{

PENDING = 'PENDING',

IN_PROGRESS = 'IN_PROGRESS',

DONE = 'DONE',

}

  

export class Task {

    id: string

    title: string

    description: string

    status: taskStatus

}
```

Creamos una clase llama Task, que tiene distintos atributos los cuales reciben datos de cadenas de texto, y el status se complementa con la funcion taskStatus, que puede contener 3 estados.

Una vez tenemos definida nuestra entidad, procedemos a crear un servicio

### Creacion de un servicio

Los servicios estan destinados, para que creemos metodos que vamos a reutilizar constantemente, por ejemplo en una aplicacion de tareas, tenemos que listar, actualizar, eliminar y crear una tarea, por lo que podemos crearlos en este apartado:

```js
import { Injectable } from '@nestjs/common';

@Injectable()

export class TasksService {

  

    getAllTasks(){}

    createTask(){}

    updateTask(){}

    deleteTask(){}

}
```



Ahora actualizamos el controlador, para que en lugar de que devuelva un hello world, me devuelva una lista de tareas, que hemos creado previamente en el archivo de servicio:

```js
import { Controller, Get } from '@nestjs/common';

import { TasksService } from './tasks.service';

  

@Controller('tasks')

export class TasksController {

  

    constructor(private tasksService: TasksService) {}

    @Get()

    getAllTasks() {

        return this.tasksService.getAllTasks()

    }

}
```


Y modificamos nuestro archivo de servicio, en especifico la funcion getAllTasks():

```js
import { Injectable } from '@nestjs/common';

  

@Injectable()

export class TasksService {

  

    getAllTasks(){

        return [{

            id:1,

            title: 'first task',

            description: 'some task'

        }]

    }

    createTask(){}

    updateTask(){}

    deleteTask(){}

}
```


Y si navegamos hacia la ruta especifica:

![[Pasted image 20240131102750.png]]

ya nos muestra el arreglo.

Pero vamos a hacer un par de modificaciones para dar una mejor funcionalidad.
- El primero de los cambios, sera mover afuera el apartado de tasks, para que se pueda acceder al arreglo desde cualquiera de las 4 funciones y no solo de la funcion getAllTasks().
- El segundo sera modificar la funcion getAllTasks() por simplemente hacer el llamado al arreglo.
- El tercer cambio sera crear la logica del endpoint createTask(), creando una constante que haga referencia al formato completo de una Tarea y crear el push hacia el arreglo creado con anterioridad.


```js
import { Injectable } from '@nestjs/common';

import { Task, TaskStatus } from './task.entity';

import { v4 } from 'uuid';

  

@Injectable()

export class TasksService {

  private tasks: Task[] = [

    {

      id: '1',

      title: 'first task',

      description: 'some task',

      status: TaskStatus.PENDING,

    },

  ];

  

  getAllTasks() {

    return this.tasks;

  }

  createTask(title: string, description: string) {

    const task = {

      id: v4(),

      title,

      description,

      status: TaskStatus.PENDING,

    };

    this.tasks.push(task);

  

    return task;

  }

  updateTask() {}

  deleteTask() {}

}
```


En consecuencia el codigo nos quedaria asi de momento.

Y probamos hacer una peticion GET nuevamente:

![[Pasted image 20240131111819.png]]

Si hacemos una peticion POST a la  misma ruta tambien podemos observar un resultado, pero para esto es necesario crear un DTO.

### DTO

Los DTO no son más que **clases customizadas que tu mismo puedes crear para indicar la estructura que tendrán los objetos de entrada en una solicitud**.

```js
export class CreateTaskDto {

    title: string

    description: string

}
```

De esta forma podemos modificar el controlador:

```js
import { Body, Controller, Get, Post } from '@nestjs/common';

import { TasksService } from './tasks.service';

import { CreateTaskDto } from './dto/task.dto';

  

@Controller('tasks')

export class TasksController {

  constructor(private tasksService: TasksService) {}

  @Get()

  getAllTasks() {

    return this.tasksService.getAllTasks();

  }

  

  @Post()

  createTask(@Body() newTask: CreateTaskDto) {

    return this.tasksService.createTask(newTask.title, newTask.description);

  }

}
```


Y probamos haciendo una peticion POST:

![[Pasted image 20240131113716.png]]


Y si listamos todas las tareas:

![[Pasted image 20240131113811.png]]

Se habra guardado con exito.

### Eliminar una tarea

Para eliminar una tarea comparamos el id con todos los elementos del arreglo, y si coincide simplemente lo sacamos de la lista:

```js
 deleteTask(id: string) {

    this.tasks = this.tasks.filter(task => task.id !== id)

  }
```


a su vez en la ruta agregamos el metodo Delete y hacemos un return que el elemento se ha eliminado con exito:

```js
  @Delete(':id')

  deleteTask(@Param('id') id: string) {

    this.tasksService.deleteTask(id)

    return 'Elemento Eliminado con Exito!'

  }
```


### Actualizar una tarea

Para actualizar una tarea, la logica es similar a la de eliminar una tarea

```js
getTaskByID(id: string): Task {

    return this.tasks.find(task => task.id === id)

  }
```

Primero creamos una funcion que nos devuelva solamente una tarea, en este caso el parametro a filtrar es el id.

Una vez tenemos la tarea podemos proceder a actualizar la tarea:

```js
updateTask(id: string, updatedFields: UpdateTaskDto): Task {

    const task = this.getTaskByID(id)

    const newTask = Object.assign(task, updatedFields)

    this.tasks = this.tasks.map(task => task.id === id ? newTask : task)

    return newTask;

  }
```


mapeamos los arreglos y asignamos el nuevo arreglo para que se actualicen los datos, en este caso tambien creamos un dto, para filtrar de manera correcta los datos:

```js
export class UpdateTaskDto {

    title?: string;

    description?: string;

    status?: TaskStatus;

}
```

Con la diferencia que los valores, quedan opcionales y no son obligatorios por eso el signo de interrogacion.

Y por ultimo creamos la ruta en nuestro controlador:

```js
  @Patch(":id")

  updateTask(@Param("id") id: string, @Body() updateFields: UpdateTaskDto){

    return this.tasksService.updateTask(id, updateFields)

  }
```

### Obtener solo una tarea

Con la funcion anterior podemos crear una ruta en el controlador en el que solo recibamos una tarea exclusivamente, para esto lo realizamos de la siguiente forma:

```js
 @Get(":id")

  getTaskByID(@Param('id') id: string) {

    return this.tasksService.getTaskByID(id);

  }
```


### Validaciones

Para iniciar con las validaciones instalamos el siguiente paquete:

```bash
npm i --save class-validator class-transformer
```

Para las validaciones hay distintas formas de hacerlo, de hecho se puede consultar la pagina web oficial de nest js, pero la mas sencilla y general seria de la siguiente forma, en nuestro archivo main.ts:

```ts
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

  

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe)

  await app.listen(3000);

}

bootstrap();
```

Agregamos la linea de codigo GlobalPipes y en nuestro archivo DTO, configuramos lo siguiente:

```ts
  

import { TaskStatus } from "../task.entity"

import {IsIn, IsNotEmpty, IsOptional, IsString, MinLength} from 'class-validator'

  

export class CreateTaskDto {

    @IsString()

    @IsNotEmpty()

    @MinLength(3)

    title: string;

  

    @IsString()

    @IsNotEmpty()

    @MinLength(3)

    description: string;

}

  

export class UpdateTaskDto {

  

    @IsString()

    @IsOptional()

    title?: string;

  

    @IsString()

    @IsOptional()

    description?: string;

  

    @IsString()

    @IsOptional()

    @IsIn([TaskStatus.PENDING, TaskStatus.DONE, TaskStatus.IN_PROGRESS])

    status?: TaskStatus;

}
```

Cada una de las validaciones tiene su proposito, como la longitud de la cadena de texto, si es opcional o que no este vacio, asi puedes ir cambiando las validaciones segun sea necesario y conveniente para ti.

Con esto hemos finalizado la aplicacion!
---
share_link: https://share.note.sx/6bdjtq21#moeD/NmVZGPpi6wt079c55aYVsjDJK2a0EezKosWyuY
share_updated: 2024-01-31T13:44:48-06:00
---
Es un marco de trabajo para construir aplicaciones eficientes y escalables del lado del servidor de Node.JS. Utiliza JavaScript Progresivo y esta construido en TypeScript.

Esencialmente, NestJS es una capa sobre Node que tiene métodos e implementaciones sobrecargadas que pueden ayudarnos a escribir aplicaciones del lado del servidor de forma rápida y sencilla.

## ¿Por qué podríamos necesitar Nest.js cuando tenemos Node.js?

- Nest proporciona una capa de abstracción sobre Node, lo que significa que ahora puede aprovechar las características de Node así como exponer APIs sobrealimentadas para un mejor rendimiento y eficiencia.
- Tiene tienes acceso a toneladas de módulos de terceros que pueden acelerar tu proceso de desarrollo.
- NestJS también es altamente configurable con ORM's (como TypeORM) que podemos aprovechar para trabajar con bases de datos. Esto significa de nuevo que también tienes grandes características de TypeORM como el patrón Active Record y Data Mapper que ahora puedes aprovechar fácilmente.

### ¿Qué es un ORM?

Object Relational Mappings, Un ORM es un modelo de programación que permite mapear las estructuras de una base de datos relacional (SQL Server, Oracle, MySQL, etc.), en adelante RDBMS (Relational Database Management System), sobre una estructura lógica de entidades con el objeto de simplificar y acelerar el desarrollo de nuestras aplicaciones.

## Arquitectura de un proyecto en NestJS

![[Pasted image 20240130102819.png]]

#### 1. Controladores:  El único propósito de un controlador es recibir las peticiones de la aplicación y ocuparse de las rutas.
#### 2. Capa de servicio: Esta parte del bloque debe incluir únicamente la lógica de negocio. Por ejemplo, todas las operaciones CRUD y los métodos para determinar cómo se pueden crear, almacenar y actualizar los datos.
#### 3. Capa de acceso a los datos: Esta capa se encarga y proporciona la lógica para acceder a los datos almacenados en un almacenamiento persistente de algún tipo. Por ejemplo un ODM como Mongoose.

## Estructura del directorio de un proyecto NestJS


```javascript
src
| — app.controller.spec.ts
| — app.controller.ts
| — app.module.ts
| — app.service.ts
| — main.ts
```


#### 1. ****__`app.controller.ts`__**_:_** Archivo del controlador que **contendrá todas las rutas** de la aplicación.
#### 2. __****`app.controller.spec.ts`****_**:**_  Este archivo ayudaría a **escribir pruebas unitarias** para los controladores.
#### 3. __****`app.module.ts`****__ El archivo de módulo esencialmente **agrupa todos los controladores y proveedores** de su aplicación.
#### 4. __****`app.service.ts`****__ El servicio incluirá **métodos** que realizarán una determinada operación. _Por ejemplo_: **Registrar un nuevo usuario.**
#### 5. __****`main.ts`****__ El archivo de entrada de la aplicación **tomará su paquete de módulos** y creará una instancia de la aplicación utilizando el **NestFactory** proporcionado por _Nest._

---
## Instalación de NestJS

Requerimientos:

- NodeJS 
- NPM

Una vez tenemos instalados los requerimientos procedemos a instalar NestJS:

```powershell
npm install -g @nestjs/cli
```

Si en algun dado caso nos da error, podemos verificar que la ruta donde se almacenan los npm, este incluida en las variables de entorno de nuestro sistema:

```powershell
npm list -g | find "npm"
```

Y agregamos dicha ruta al "PATH"

---
### Creacion de un nuevo proyecto en NestJS

```javascript
nest new cat-project
```

Esperamos que terminen de generarse los archivos y tenemos lo siguiente:

![[Pasted image 20240130111841.png]]

Iniciamos el proyecto:

```javascript
npm run start
```
Si consultamos la siguiente direccion en un navegador, podremos observar la aplicacion corriendo:

```powershell
localhost:3000
```

![[Pasted image 20240130112044.png]]

## Proyecto de  Prueba

Crearemos un proyecto en el que la respuesta sea devolver muchos gatos o solo un gato para eso vamos a modificar los controladores de la aplicación como tambien los servicios:


app.controller.ts:

```javascript
import { Controller, Get } from '@nestjs/common';

import { CatsService } from './app.service';

  

@Controller('cats')

export class CatsController {

  constructor(private readonly catsService: CatsService) {}

  

  @Get('allcats')

  getCats(): string {

    return this.catsService.getAllCats();

  }

  

  @Get('onecat')

  getOneCat(): string {

    return this.catsService.getOneCat();

  }

}
```


app.module.ts:

```javascript
import { Module } from '@nestjs/common';

import { CatsController } from './app.controller';

import { CatsService } from './app.service';

  

@Module({

  imports: [],

  controllers: [CatsController],

  providers: [CatsService],

})

export class AppModule {}
```


app.service.ts:

```javascript
import { Injectable } from '@nestjs/common';

  

@Injectable()

export class CatsService {

  getAllCats(): string {

    return 'Get all cats!';

  }

  

  getOneCat(): string {

    return 'Get one cat!';

  }

}
```


Si apuntamos hacia las rutas correspondientes:

@allcats:

![[Pasted image 20240130143528.png]]

@onecat:

![[Pasted image 20240130143548.png]]



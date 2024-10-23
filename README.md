# Migrating from REST API to gRPC

This is a step by step method for migrating an existing REST API to gRPC. You will be getting a working demo project in REST API in NestJS. To tun this project in RestAPI, you will have to do `npm install` & `npm run start`.

### 1. Install Required Packages
To use gRPC with NestJS, you need to install the following packages:

```bash
npm install @nestjs/microservices grpc @grpc/proto-loader
```

### 2. Create a gRPC Proto File
Create a directory called proto in the project root and add a file users.proto and products.proto.

```protobuf
// users.proto

syntax = "proto3";

package users;

service UsersService {
  rpc Create (User) returns (User);
  rpc FindAll (Empty) returns (Users);
}

message User {
  string id = 1;
  string name = 2;
}

message Users {
  repeated User users = 1;
}

message Empty {}

```

```protobuf
// products.proto

syntax = "proto3";

package products;

service ProductsService {
  rpc Create (Product) returns (Product);
  rpc FindAll (Empty1) returns (Products);
}

message Product {
  string id = 1;
  string name = 2;
}

message Products {
  repeated Product products = 1;
}

message Empty1 {}

```

### 3. Update Services to Implement gRPC
Modify the users.service.ts and products.service.ts to implement gRPC methods.

```typescript
// users.service.ts

import { Injectable } from '@nestjs/common';
import { users } from 'src/proto/users';

@Injectable()
export class UsersService {
  private users: users.User[] = [];

  create(user: users.User): users.User {
    this.users.push(user);
    return user;
  }

  findAll(): any {
    return { users: this.users };
  }
}

```

```typescript
// products.service.ts

import { Injectable } from '@nestjs/common';
import { products } from 'src/proto/products';

@Injectable()
export class ProductsService {
  private products: products.Product[] = [];

  create(product: products.Product): products.Product {
    this.products.push(product);
    return product;
  }

  findAll(): any {
    return { products: this.products };
  }
}

```

### 4. Create gRPC Controllers
Create controllers for gRPC.

```typescript
//users.controller.ts

import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { users } from 'src/proto/users';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'Create')
  create(data: users.User): users.User {
    console.log('here');
    return this.usersService.create(data);
  }

  @GrpcMethod('UsersService', 'FindAll')
  findAll(): users.Users {
    return this.usersService.findAll();
  }
}
```

```typescript
// products.controller.ts

import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { products } from 'src/proto/products';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod('ProductsService', 'Create')
  create(data: products.Product): products.Product {
    return this.productsService.create(data);
  }

  @GrpcMethod('ProductsService', 'FindAll')
  findAll(): products.Products {
    return this.productsService.findAll();
  }
}

```

### 5. Generate Protoc files for Typescript

```bash
protoc --ts_out=. --plugin=protoc-gen-ts=$(which protoc-gen-ts) proto/products.proto
protoc --ts_out=. --plugin=protoc-gen-ts=$(which protoc-gen-ts) proto/users.proto
```

### 6. Configure gRPC in main.ts
Update the main.ts to enable gRPC microservices.

```typescript
//main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const grpcServer = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['users', 'products'],
      protoPath: ['src/proto/users.proto', 'src/proto/products.proto'],
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
```

### 7. Run the gRPC Server
Start the NestJS application:

```bash
npm run start
```

### 8. Testing the gRPC API
Test this in Postman or grpcurl.
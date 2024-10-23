import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() product) {
    return this.productsService.create(product);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}

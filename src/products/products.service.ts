import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  private products = [];

  create(product) {
    this.products.push(product);
    return product;
  }

  findAll() {
    return this.products;
  }
}

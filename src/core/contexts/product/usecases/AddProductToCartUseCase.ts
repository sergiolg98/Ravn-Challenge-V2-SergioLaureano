import { ProductRepository } from "../contracts/ProductRepository";

export class AddProductToCartUseCase { // @todo implement UseCase
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(
    productId: number,
    userId: number,
    quantity: number,
  ): Promise<any> {
    const productCreated = await this.productRepository.addToCart(productId, userId, quantity);
    return productCreated;
  }
}

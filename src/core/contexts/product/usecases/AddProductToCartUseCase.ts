
import { BadRequestError } from '../../../common/errors/BadRequestError';
import { NotFoundError } from '../../../common/errors/NotFoundError';
import { ProductRepository } from '../contracts/ProductRepository';

export class AddProductToCartUseCase {
  // @todo implement UseCase
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number, userId: number, quantity: number): Promise<any> {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError('Product not found with id provided.');

    const isDeleted = await this.productRepository.checkIfDeleted(productId);
    if (isDeleted) throw new NotFoundError(`This product has been previously deleted.`);

    const isActive = await this.productRepository.checkIfActive(productId);
    if (!isActive) throw new BadRequestError(`Product disabled. Cannot be added to the cart.`);

    await this.productRepository.addToCart(productId, userId, quantity);
    const userCart = this.productRepository.showUserCart(userId);
    return userCart;
  }
}

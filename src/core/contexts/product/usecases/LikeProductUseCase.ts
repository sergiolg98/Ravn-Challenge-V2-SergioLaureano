import { UseCaseDoubleEntry } from '../../../common/contracts/UseCase';
import { BadRequestError } from '../../../common/errors/BadRequestError';
import { NotFoundError } from '../../../common/errors/NotFoundError';
import { ProductRepository } from '../contracts/ProductRepository';

export class LikeProductUseCase implements UseCaseDoubleEntry<number, number, any> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number, userId: number): Promise<any> {
    const product = await this.productRepository.findById(productId);
    if(!product) throw new NotFoundError('Product not found with id provided.');

    const isDeleted = await this.productRepository.checkIfDeleted(productId);
    if (isDeleted) throw new NotFoundError(`This product has been previously deleted.`);

    const previousLike = await this.productRepository.checkIfPreviousLike(productId, userId);
    if (previousLike) throw new BadRequestError('Product already liked by user.');

    return await this.productRepository.like(productId, userId);
  }
}

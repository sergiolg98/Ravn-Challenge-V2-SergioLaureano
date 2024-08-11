import { UseCaseDoubleEntry } from "../../../common/contracts/UseCase";
import { ProductRepository } from "../contracts/ProductRepository";
import { ProductEntity } from "../entities/ProductEntity";

export class LikeProductUseCase implements UseCaseDoubleEntry<number, number, any> {
  private productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(productId: number, userId: number): Promise<any> {
    return await this.productRepository.like(productId, userId);
  }

}
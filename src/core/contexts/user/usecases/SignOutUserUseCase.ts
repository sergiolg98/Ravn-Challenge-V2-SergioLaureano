import { UseCase } from "../../../common/contracts/UseCase";
import { BadRequestError } from "../../../common/errors/BadRequestError";
import { InternalServerError } from "../../../common/errors/InternalServerError";
import { TokenManagementRepository } from "../contracts/TokenManagementRepository";

export class SignOutUserUseCase implements UseCase<string, {message: string}> {
  private tokenManagementRepository: TokenManagementRepository;
  constructor(tokenManagementRepository: TokenManagementRepository) {
    this.tokenManagementRepository = tokenManagementRepository;
  }

  async execute(token: string): Promise<{message: string}> {
    const alreadySignedOut: boolean = await this.tokenManagementRepository.findToken(token);
    if(alreadySignedOut) throw new BadRequestError('Session already signed out.');

    const expiresAt = new Date(Date.now() + 7200 * 1000); // +2h // greater than JWT duration time
    const response: boolean = await this.tokenManagementRepository.addToken(token, expiresAt);
    if(!response)
      throw new InternalServerError('Something went wrong while sign-out. Please try later.'); 
    
    const signedOutMessage = {
      message: 'Session ended. Signed out from system',
    };
    return signedOutMessage;
  }
}

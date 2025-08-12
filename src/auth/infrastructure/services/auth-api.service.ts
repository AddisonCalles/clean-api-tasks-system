import { Inject, Injectable } from '@nestjs/common';
import { AuthenticateUserUseCase } from '@auth/application/use-cases';
import type { AuthenticateUserRequest } from '@auth/application/inputs';
import type { AuthenticateUserResponse } from '@auth/application/outputs';
import { HandleDomainExceptions } from '@shared/infrastructure/exception.validator';
import { AUTHENTICATE_USER_USECASE } from '../providers/auth-usecases.providers';

@Injectable()
export class AuthAPIService {
  constructor(
    @Inject(AUTHENTICATE_USER_USECASE)
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
  ) {}

  @HandleDomainExceptions
  async authenticateUser(
    request: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse> {
    return await this.authenticateUserUseCase.execute(request);
  }
}

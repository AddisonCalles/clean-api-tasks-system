import { Body, Controller, Post } from '@nestjs/common';
import type { AuthenticateUserRequest } from '@auth/application/inputs';
import { AuthAPIService } from '@auth/infrastructure/services/auth-api.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authAPIService: AuthAPIService) {}

  @Post('login')
  login(@Body() authenticateUserRequest: AuthenticateUserRequest) {
    return this.authAPIService.authenticateUser(authenticateUserRequest);
  }
}

import * as fs from 'fs';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@auth/infrastructure/apis';
import { AuthAPIService } from '@auth/infrastructure/services';
import {
  authenticateUserUseCaseProvider,
  sessionManagerProvider,
} from './providers';
import { PermissionGuard } from './guards/permission.guard';
import { UserExportsModule } from '@users/infrastructure/user.exports.module';
import { authorizeUserUseCaseProvider } from './providers/auth-usecases.providers';

@Module({
  imports: [
    UserExportsModule,
    JwtModule.register({
      global: true,
      privateKey: fs.readFileSync(path.join(__dirname, 'keys', 'private.key')),
      publicKey: fs.readFileSync(path.join(__dirname, 'keys', 'public.key')),
      signOptions: {
        expiresIn: '60m',
        algorithm: 'RS256',
      },
    }),
  ],
  providers: [
    AuthAPIService,
    PermissionGuard,
    sessionManagerProvider,
    authorizeUserUseCaseProvider,
    authenticateUserUseCaseProvider,
  ],
  controllers: [AuthController],
  exports: [
    sessionManagerProvider,
    PermissionGuard,
    authenticateUserUseCaseProvider,
    authorizeUserUseCaseProvider,
  ],
})
export class AuthModule {}

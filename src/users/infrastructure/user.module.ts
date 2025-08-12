import { Module } from '@nestjs/common';
import { UserAPIService } from './services/user-api.service';
import { UserController } from './apis/user.controller';
import { RoleController } from './apis/role.controller';

import { AuthModule } from '@auth/infrastructure/auth.module';
import { UserExportsModule } from './user.exports.module';

@Module({
  imports: [AuthModule, UserExportsModule],
  controllers: [UserController, RoleController],
  providers: [UserAPIService],
  exports: [],
})
export class UserModule {}

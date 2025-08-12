import { Module } from '@nestjs/common';
import { AuthModule } from '@auth/infrastructure/auth.module';
import { TaskModule } from '@tasks/infrastructure/task.module';
import { UserModule } from '@users/infrastructure/user.module';

@Module({
  imports: [TaskModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

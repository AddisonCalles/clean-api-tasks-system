import { Module } from '@nestjs/common';
import { TaskModule } from '@tasks/infrastructure/task.module';

@Module({
  imports: [TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

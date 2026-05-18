import { LoggerMiddleware } from './../common/middlewares/logger.middleware';
import { TasksModule } from 'src/tasks/tasks.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';

@Module({
  imports: [
    TasksModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      })
  }
}
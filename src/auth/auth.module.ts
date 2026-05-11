import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { HashingServiceProtocol } from './hash/hashing.service';
import { BcryptService } from './hash/bcrypt.service';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [
    AuthService,
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService
    }
  ],
  controllers: [AuthController],
  exports: [HashingServiceProtocol]
})
export class AuthModule {}

import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { SignInDto } from './dto/signin.dto';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfigService: ConfigType<typeof jwtConfig>,
    private readonly jwtservice: JwtService,
  ) {}

  async authenticate(signInDto: SignInDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: signInDto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid user credentials');

    const isPasswordValid = await this.hashingService.compare(
      signInDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid user credentials');

    const token = await this.jwtservice.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.jwtConfigService.secret,
        expiresIn: this.jwtConfigService.ttl,
        audience: this.jwtConfigService.audience,
        issuer: this.jwtConfigService.issuer,
      },
    );

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token
    };
  }
}

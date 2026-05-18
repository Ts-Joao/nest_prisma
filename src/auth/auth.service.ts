import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly hashingService: HashingServiceProtocol
    ) {}

    async authenticate(signInDto: SignInDto) {
        const user = await this.databaseService.user.findUnique({
            where: { email: signInDto.email }
        })

        if (!user) throw new UnauthorizedException('Invalid user credentials')

        const isPasswordValid = await this.hashingService.compare(
            signInDto.password,
            user.passwordHash
        )

        if (!isPasswordValid) throw new UnauthorizedException('Invalid user credentials')

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            message: 'authentication successful'
        }
    }
}

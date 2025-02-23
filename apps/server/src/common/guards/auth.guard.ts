import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { verifyToken } from '@clerk/backend';
import { ConfigService } from '@nestjs/config';
import { ClerkClientService } from '../services/clerk-client.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly clerkClientService: ClerkClientService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies.__session;
    console.log(token);
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get('CLERK_SECRET_KEY'),
      });

      const user = await this.clerkClientService
        .getClient()
        .users.getUser(tokenPayload.sub);
      request.user = { id: user.id };
    } catch (e) {
      console.error(e);

      throw new UnauthorizedException('Invalid authentication credentials');
    }

    return true;
  }
}

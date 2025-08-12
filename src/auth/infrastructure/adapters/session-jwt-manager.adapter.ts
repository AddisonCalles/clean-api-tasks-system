import { SessionManagerPort } from '@auth/application/ports';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from '@shared/domain/entities/user-session.entity';

export class SessionJwtManagerAdapter implements SessionManagerPort {
  constructor(private readonly jwtService: JwtService) {}

  createSession(
    userId: string,
    email: string,
    role: string,
  ): Promise<UserSession> {
    const payload = {
      userId,
      email,
      role,
    };
    const token = this.jwtService.sign(payload);
    return Promise.resolve(
      new UserSession(
        token,
        userId,
        role,
        email,
        new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      ),
    );
  }

  readSession(sessionIdentifier: string): Promise<UserSession> {
    const payload = this.jwtService.verify<{
      userId: string;
      email: string;
      role: string;
      expiresAt: string;
    }>(sessionIdentifier);
    return Promise.resolve(
      new UserSession(
        sessionIdentifier,
        payload.userId,
        payload.role,
        payload.email,
        new Date(payload.expiresAt),
      ),
    );
  }
}

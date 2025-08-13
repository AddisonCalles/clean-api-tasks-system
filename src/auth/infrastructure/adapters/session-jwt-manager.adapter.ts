import * as fs from 'fs';
import * as path from 'path';
import { SessionManagerPort } from '@auth/application/ports';
import { JwtService } from '@nestjs/jwt';
import { UserSession } from '@auth/domain/entities/user-session.entity';

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

    // Obtener la fecha de expiración del token JWT
    const decodedToken = this.jwtService.decode(token);
    const expiresAt = new Date(decodedToken.exp * 1000); // Convertir de segundos a milisegundos

    return Promise.resolve(
      new UserSession(token, userId, role, email, expiresAt),
    );
  }

  readSession(sessionIdentifier: string): Promise<UserSession> {
    try {
      console.log('sessionIdentifier', sessionIdentifier, 'Check');
      const payload = this.jwtService.verify<{
        userId: string;
        email: string;
        role: string;
        exp: number;
      }>(sessionIdentifier);
      console.log('payload', payload, 'Check');

      // Convertir el timestamp de expiración de segundos a milisegundos
      const expiresAt = new Date(payload.exp * 1000);

      return Promise.resolve(
        new UserSession(
          sessionIdentifier,
          payload.userId,
          payload.role,
          payload.email,
          expiresAt,
        ),
      );
    } catch (error) {
      console.error('Error verifying JWT token:', error);
      throw new Error('Invalid or expired session token');
    }
  }
}

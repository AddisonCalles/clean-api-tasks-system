import { UserSession } from '@shared/domain/entities/user-session.entity';

export abstract class SessionManagerPort {
  abstract createSession(
    userId: string,
    email: string,
    role: string,
  ): Promise<UserSession>;

  abstract readSession(sessionIdentifier: string): Promise<UserSession>;
}

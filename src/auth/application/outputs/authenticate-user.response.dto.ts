import { UserSession } from '@auth/domain/entities/user-session.entity';

export interface AuthenticateUserResponse {
  session: UserSession;
  name: string;
  permissions: string[];
}

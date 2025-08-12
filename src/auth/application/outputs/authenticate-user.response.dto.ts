import { UserSession } from '@shared/domain/entities/user-session.entity';

export interface AuthenticateUserResponse {
  session: UserSession;
  name: string;
  permissions: string[];
}

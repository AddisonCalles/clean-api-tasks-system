import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionManagerPort } from '@auth/application/ports/session-manager.port';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import {
  AUTHORIZE_USER_USECASE,
  SESSION_MANAGER_PORT,
} from '../providers/auth-usecases.providers';
import { AuthorizeUserUseCase } from '@auth/application/use-cases/authorize-user.use-case';
import { UserId, PermissionName } from '@users/domain/value-objects';
import { UserSession } from '@auth/domain/entities/user-session.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
    @Inject(AUTHORIZE_USER_USECASE)
    private readonly authorizeUserUseCase: AuthorizeUserUseCase,

    @Inject(SESSION_MANAGER_PORT)
    private readonly sessionManager: SessionManagerPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new ForbiddenException('Token not provided');
    }

    try {
      const session = await this.sessionManager.readSession(token);

      const userPermissions = await this.authorizeUserUseCase.execute({
        userId: new UserId(session.getUserId() as any),
        requiredPermissions: requiredPermissions.map(
          (permission) => new PermissionName(permission as any),
        ),
      });

      // SET USER SESSION IN REQUEST
      request.userSession = session;

      return userPermissions.isAuthorized;
    } catch (error) {
      console.error('PermissionGuard error:', error);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException(
        `Invalid token or session: ${error.message}`,
      );
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

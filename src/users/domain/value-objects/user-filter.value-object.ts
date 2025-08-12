import { ValueObject } from '@shared/domain/value-objects/value-object';
import { UserFilterInvalidException } from '../exceptions/user-filter-invalid.exception';

export interface UserFilterOptions {
  name?: string;
  email?: string;
  roleName?: string;
  limit?: number;
  offset?: number;
}

export class UserFilter extends ValueObject<UserFilterOptions> {
  constructor(value: UserFilterOptions) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: UserFilterOptions): void {
    if (value.limit !== undefined && (value.limit < 1 || value.limit > 100)) {
      throw new UserFilterInvalidException('Limit must be between 1 and 100');
    }

    if (value.offset !== undefined && value.offset < 0) {
      throw new UserFilterInvalidException('Offset must be non-negative');
    }

    if (value.name && value.name.trim().length === 0) {
      throw new UserFilterInvalidException(
        'Name filter cannot be empty string',
      );
    }

    if (value.email && value.email.trim().length === 0) {
      throw new UserFilterInvalidException(
        'Email filter cannot be empty string',
      );
    }

    if (value.roleName && value.roleName.trim().length === 0) {
      throw new UserFilterInvalidException(
        'Role name filter cannot be empty string',
      );
    }
  }

  public hasNameFilter(): boolean {
    return !!this.value.name;
  }

  public hasEmailFilter(): boolean {
    return !!this.value.email;
  }

  public hasRoleFilter(): boolean {
    return !!this.value.roleName;
  }

  public getLimit(): number {
    return this.value.limit || 10;
  }

  public getOffset(): number {
    return this.value.offset || 0;
  }

  public getName(): string | undefined {
    return this.value.name;
  }

  public getEmail(): string | undefined {
    return this.value.email;
  }

  public getRoleName(): string | undefined {
    return this.value.roleName;
  }
}

export class UserSession {
  constructor(
    private readonly token: string,
    private readonly userId: string,
    private readonly role: string,
    private readonly email: string,
    private readonly expiresAt: Date,
  ) {}

  public getToken(): string {
    return this.token;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): string {
    return this.role;
  }

  public getExpiresAt(): Date {
    return this.expiresAt;
  }

  public getUserId(): string {
    return this.userId;
  }

  /**
   * @returns The number of milliseconds until the session expires
   */
  public getExpiresIn(): number {
    return this.expiresAt.getTime() - Date.now();
  }

  public isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }

  public toJSON(): Record<string, string | number | Date> {
    return {
      token: this.token,
      userId: this.userId,
      role: this.role,
      email: this.email,
      expiresAt: this.expiresAt.toISOString(),
    };
  }
}

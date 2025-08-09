export abstract class ValueObject<T> {
  constructor(public value: T) {}

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this.value === other.value;
  }

  public toString(): string {
    return String(this.value);
  }
}

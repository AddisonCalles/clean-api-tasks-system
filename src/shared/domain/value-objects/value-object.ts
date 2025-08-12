export abstract class ValueObject<T> {
  constructor(private _value: T) {}

  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._value === other._value;
  }

  public set value(value: T) {
    this._value = value;
  }

  public get value(): T {
    return this._value;
  }

  public toString(): string {
    return String(this.value);
  }
}

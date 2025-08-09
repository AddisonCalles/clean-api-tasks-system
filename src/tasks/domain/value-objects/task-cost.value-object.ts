import { ValueObject } from '@shared/domain/value-objects/value-object';
import { TaskCostInvalidException } from '@tasks/domain/exceptions';

export class TaskCost extends ValueObject<number> {
  constructor(value: number) {
    super(value);
    this.ensureValidFormat(value);
  }

  private ensureValidFormat(value: number): void {
    if (value < 0) {
      throw new TaskCostInvalidException('Task cost cannot be negative');
    }

    if (value > 1000000) {
      throw new TaskCostInvalidException('Task cost cannot exceed 1,000,000');
    }
  }

  public add(cost: number): TaskCost {
    return new TaskCost(this.value + cost);
  }

  public subtract(cost: number): TaskCost {
    return new TaskCost(Math.max(0, this.value - cost));
  }

  public toString(): string {
    return this.value.toFixed(2);
  }

  public getFormatted(): string {
    return `$${this.value.toFixed(2)}`;
  }
}

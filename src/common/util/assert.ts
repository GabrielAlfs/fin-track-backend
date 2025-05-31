export class Assert {
  public static isTrue(expression: boolean, exception: Error): void {
    if (!expression) {
      throw exception;
    }
  }

  public static isFalse(expression: boolean, exception: Error): void {
    if (expression) {
      throw exception;
    }
  }

  public static notEmpty<T>(value: T | null | undefined, exception: Error): T {
    if (value === null || value === undefined) {
      throw exception;
    }
    return value;
  }

  public static isEmpty<T>(
    value: T | null | undefined,
    exception: Error,
  ): void {
    if (value !== null && value !== undefined) {
      throw exception;
    }
  }
}

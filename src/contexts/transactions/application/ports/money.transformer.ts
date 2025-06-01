export abstract class MoneyTransformer {
  abstract toCents(amount: number): number;
  abstract fromCents(amountInCents: number): number;
}

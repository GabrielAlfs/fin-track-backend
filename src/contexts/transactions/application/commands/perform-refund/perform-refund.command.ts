interface PerformRefundCommandParams {
  accountId: string;
  transactionId: string;
  description?: string;
}

export class PerformRefundCommand implements PerformRefundCommandParams {
  accountId: string;
  transactionId: string;
  description?: string;

  constructor(params: PerformRefundCommandParams) {
    Object.assign(this, params);
  }
}

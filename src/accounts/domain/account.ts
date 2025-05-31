export interface AccountParams {
  id: string;
  userId: string;
  balanceInCents: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Account implements AccountParams {
  id: string;
  userId: string;
  balanceInCents: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: AccountParams) {
    Object.assign(this, params);
  }
}

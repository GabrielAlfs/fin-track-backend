export interface UserParams {
  id: string;
  username: string;
  createdAt: Date;
}

export class User implements UserParams {
  id: string;
  username: string;
  createdAt: Date;

  constructor(params: UserParams) {
    Object.assign(this, params);
  }
}

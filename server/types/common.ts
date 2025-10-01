export type Role = 'shopper'|'retailer'|'mall'|'admin';

export interface UserAuth {
  userId: string;
  role: Role;
  retailerId?: string;
  mallId?: string;
  email?: string;
}

export interface ApiSuccess { ok: true }
export interface ApiError { error: string }
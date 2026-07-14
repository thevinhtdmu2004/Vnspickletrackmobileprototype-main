import { apiRequest, storeAccessToken, storeSessionIdentity } from './apiClient';

export type Role = 'admin' | 'coach' | 'member';
export interface AuthSession {
  role: Role;
  displayName: string;
}

interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  role: Role;
  displayName: string;
}

export async function login(account: string, pin: string): Promise<AuthSession> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ account, pin }),
  });

  storeAccessToken(response.accessToken);
  storeSessionIdentity(account);
  return {
    role: response.role,
    displayName: response.displayName,
  };
}

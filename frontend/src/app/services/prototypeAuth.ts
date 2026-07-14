export type Role = 'admin' | 'coach' | 'member';
export interface PrototypeAuthSession {
  role: Role;
  displayName: string;
}

type PrototypeLoginResponse = {
  role: Role;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  memberCode?: string | null;
  source: string;
};

const DEFAULT_API_BASE_URL = 'http://localhost:5026';

function getApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL;
  return typeof value === 'string' && value.trim() ? value.trim().replace(/\/$/, '') : DEFAULT_API_BASE_URL;
}

export async function loginWithPrototypeApi(account: string, pin: string): Promise<PrototypeAuthSession | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/prototype-auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account, pin }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as PrototypeLoginResponse;
    return {
      role: data.role,
      displayName: data.fullName,
    };
  } catch {
    return null;
  }
}

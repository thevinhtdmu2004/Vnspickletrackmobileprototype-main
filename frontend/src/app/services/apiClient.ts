const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5081/api/v1';

interface ApiError {
  code: string;
  field?: string | null;
  message: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: ApiError[];
}

const ACCESS_TOKEN_KEY = 'pickletrack.accessToken';
const SESSION_IDENTITY_KEY = 'pickletrack.sessionIdentity';

export function storeAccessToken(token: string) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function storeSessionIdentity(identity: string) {
  const normalizedIdentity = identity.trim().toLowerCase();
  if (!normalizedIdentity) return;
  sessionStorage.setItem(SESSION_IDENTITY_KEY, normalizedIdentity);
}

export function getSessionIdentity() {
  return sessionStorage.getItem(SESSION_IDENTITY_KEY);
}

export function clearAccessToken() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_IDENTITY_KEY);
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const envelope = await response.json() as ApiEnvelope<T>;

  if (!response.ok || !envelope.success || envelope.data === null) {
    throw new Error(
      envelope.message ||
      envelope.errors[0]?.message ||
      'Không thể kết nối đến máy chủ.',
    );
  }

  return envelope.data;
}

export async function apiRequestNullable<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  const token = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const envelope = await response.json() as ApiEnvelope<T>;

  if (!response.ok || !envelope.success) {
    throw new Error(
      envelope.message ||
      envelope.errors[0]?.message ||
      'Không thể kết nối đến máy chủ.',
    );
  }

  return envelope.data;
}

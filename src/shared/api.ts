const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const json = await res.json();
  if (!json.success) {
    const err = new Error(json.message ?? 'Request failed') as Error & { code: number };
    err.code = json.code ?? res.status;
    throw err;
  }
  return json.data as T;
}

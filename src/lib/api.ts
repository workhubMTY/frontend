const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

async function authFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { headers = {}, ...rest } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    ...rest,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? `Error ${response.status}`);
  }

  return payload.data as T;
}

export { authFetch, API_URL };

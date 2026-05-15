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

  // Evita romper si no viene JSON
  let payload: any = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    // 401 = no autenticado
    if (response.status === 401) {
      // Evita loops infinitos si ya estás en login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    throw new Error(payload?.message ?? `Error ${response.status}`);
  }

  return payload.data as T;
}

export { authFetch, API_URL };
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

type AuthAccessors = {
  getAccessToken: () => string | null;
  silentRefresh: () => Promise<string | null>;
};

let _auth: AuthAccessors | null = null;

export function registerAuthAccessors(accessors: AuthAccessors) {
  _auth = accessors;
}

async function fetchWithToken<T>(
  endpoint: string,
  token: string,
  options: RequestOptions
): Promise<Response> {
  const { headers = {}, ...rest } = options;
  return fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...headers,
    },
    credentials: "include", // still needed for refresh cookie on /auth/refresh
    ...rest,
  });
}

export function getExportToken(): string | null {
  return _auth?.getAccessToken() ?? null;
}

async function authFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  if (!_auth) {
    throw new Error("[authFetch] Auth accessors not registered. Wrap your app in AuthProvider.");
  }

  let token = _auth.getAccessToken();

  if (!token) {
    token = await _auth.silentRefresh();
    if (!token) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("No autenticado");
    }
  }

  let response = await fetchWithToken(endpoint, token, options);
  if (response.status === 401) {
    const newToken = await _auth.silentRefresh();

    if (!newToken) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("Sesión expirada");
    }

    response = await fetchWithToken(endpoint, newToken, options);

    if (response.status === 401) {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("Sesión expirada");
    }
  }

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    console.log("API error response:", { endpoint, status: response.status, payload });
    const err: any = new Error(payload?.message ?? `Error ${response.status}`);
    err.status = response.status;
    err.body = payload;
    throw err;
  }

  return payload.data as T;
}

export { authFetch, API_URL };
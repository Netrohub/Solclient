import axios, { AxiosRequestConfig } from "axios";

function normalizeApiUrl(url: string): string {
  if (!url) return "http://localhost:3001";
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

export const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL || "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

let csrfTokenPromise: Promise<void> | null = null;

async function fetchCsrfToken(): Promise<void> {
  try {
    const response = await api.get<{ csrfToken: string }>("/auth/csrf", {
      withCredentials: true,
    });
    if (response.data?.csrfToken) {
      api.defaults.headers.common["X-CSRF-Token"] = response.data.csrfToken;
    }
  } finally {
    csrfTokenPromise = null;
  }
}

export function ensureCsrfToken(): Promise<void> {
  if (api.defaults.headers.common["X-CSRF-Token"]) {
    return Promise.resolve();
  }

  if (!csrfTokenPromise) {
    csrfTokenPromise = fetchCsrfToken();
  }

  return csrfTokenPromise;
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() ?? "get";
  const safeMethods = new Set(["get", "head", "options", "trace"]);

  if (!safeMethods.has(method)) {
    await ensureCsrfToken();
    config.headers = {
      ...(config.headers || {}),
      "X-CSRF-Token": api.defaults.headers.common["X-CSRF-Token"],
    };
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 403 &&
      error.response?.data?.error === "Invalid CSRF token" &&
      error.config
    ) {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      delete api.defaults.headers.common["X-CSRF-Token"];
      await ensureCsrfToken();

      originalRequest.headers = {
        ...(originalRequest.headers || {}),
        "X-CSRF-Token": api.defaults.headers.common["X-CSRF-Token"],
      };

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export { api };

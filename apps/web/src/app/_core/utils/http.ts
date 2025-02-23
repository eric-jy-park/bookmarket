import { cookies } from "next/headers";

class Http {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    data?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}/${path}`;
    const options: RequestInit = {
      method,
      headers: {
        Cookie: cookies().toString(),
        ...(data ? { "Content-Type": "application/json" } : {}),
      },
      credentials: "include",
      ...(data ? { body: JSON.stringify(data) } : {}),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return (await response.json()) as T;
    } catch (error) {
      console.error("API request failed:", error);
      throw new Error(`Request failed: ${(error as Error).message}`);
    }
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    return this.request<T>("POST", path, data);
  }

  async put<T>(path: string, data: unknown): Promise<T> {
    return this.request<T>("PUT", path, data);
  }

  async patch<T>(path: string, data: unknown): Promise<T> {
    return this.request<T>("PATCH", path, data);
  }

  async delete<T>(path: string, data?: unknown): Promise<T> {
    return this.request<T>("DELETE", path, data);
  }
}

export const http = new Http(process.env.NEXT_PUBLIC_BASE_URL!);

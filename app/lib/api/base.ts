import { redirect } from "@remix-run/node";
import { getConfig } from "~/config/config";

export interface ApiResponse<T = any> {
  code: string;
  message: string;
  data: T;
}

// Helper function to extract the access token from cookies
function getAccessTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((cookie) => cookie.trim().split("="))
  );

  return cookies["access_token"] || null;
}

// Custom error class for 4xx errors to allow handling redirects
class ApiAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiAuthError";
  }
}

// Base request function to handle API calls with authentication
export async function sendRequest<T>(
  request: Request,
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const apiUrl = getConfig().backendApiBaseUrl + endpoint;
  const token = getAccessTokenFromRequest(request);

  // Set headers
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    // Make the request
    const response = await fetch(apiUrl, {
      ...options,
      headers,
    });

    // Check if the status is 401 UnAuthorized
    if (response.status == 401) {
      // Throw an error so we can handle the redirect higher up
      throw new ApiAuthError("Authentication error, redirecting to logout");
    }

    // Parse the JSON response
    const jsonResponse: ApiResponse<T> = await response.json();
    // console.log("jsonResponse: ", jsonResponse);

    return jsonResponse;
  } catch (error) {
    // Handle redirect if an ApiAuthError is thrown
    if (error instanceof ApiAuthError) {
      throw redirect("/logout");
    }
    throw new Error(`API request failed: ${error}`);
  }
}

// Utility function to convert a string from snake_case to camelCase
function toCamelCaseString(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// General function to convert an object's keys from snake_case to camelCase
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const camelCaseKey = toCamelCaseString(key);
      result[camelCaseKey] = toCamelCase(obj[key]); // Recursively apply toCamelCase
      return result;
    }, {} as any);
  }
  return obj; // Return the value if it's not an object or array
}

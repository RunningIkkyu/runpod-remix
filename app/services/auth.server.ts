// auth.server.ts
import { redirect } from "@remix-run/node";
import { createCookie } from "@remix-run/node"; // For cookie creation
// import { getConfig } from "~/config"; // Assuming you have this for getting your backend API URL
import { jwtDecode } from "jwt-decode";
import { parse } from "cookie"; // For parsing cookies
import { ApiResponse, sendRequest } from "./api.base.server";

const COOKIE_TOKEN_KEY = "access_token";

interface LoginResponse {
  access_token: string;
}

export async function loginAuth(username: string, password: string) {
  if (!username || !password) {
    return redirect("/login", { status: 400 });
  }

  try {
    // Call the backend login API
    const body = { username, password };
    const resp = await sendRequest<LoginResponse>(null, "/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const access_token = resp.data.access_token;
    console.log(access_token);

    const headers = new Headers();
    // Set JWT as a cookie (without signing)
    headers.append(
      "Set-Cookie",
      `${COOKIE_TOKEN_KEY}=${access_token}; Max-Age=${60 * 60 * 24 * 7
      }; HttpOnly; Path=/; ${process.env.NODE_ENV === "production" ? "Secure" : ""
      }; SameSite=Lax`
    );

    // Decode the token (optional: you can use this decoded token later)
    const decodedToken = jwtDecode(access_token);
    console.log("user: ", decodedToken);

    // On success, redirect to /console
    return redirect("/console", { headers });
  } catch (error) {
    console.log("-> login failed, error: ", error);
    // In case of error, redirect to login page
    return redirect("/login", { status: 500 });
  }
}

export async function getUserFromSession(request: Request) {
  // Get cookies from the request
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null; // No cookies found
  }

  // Parse the cookies
  const cookies = parse(cookieHeader);
  const token = cookies[COOKIE_TOKEN_KEY];

  if (!token) {
    return null; // No token found
  }

  try {
    // Decode the JWT token
    const decodedToken: any = jwtDecode(token);
    console.log("decodedToken", decodedToken);

    // Optionally, check for expiration if your token has exp claim
    const currentTime = Date.now() / 1000; // Get current time in seconds
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log("Token expired");
      return null; // Token expired
    }

    // Return the decoded token object (user information)
    return decodedToken;
  } catch (error) {
    return null; // Failed to decode token
  }
}

export async function logout(request: Request) {
  // Invalidate the token by setting it with a past expiration date
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    `${COOKIE_TOKEN_KEY}=; Max-Age=0; HttpOnly; Path=/; ${process.env.NODE_ENV === "production" ? "Secure" : ""
    }; SameSite=Lax`
  );

  // Redirect the user to the login page after logout
  return redirect("/login", { headers });
}

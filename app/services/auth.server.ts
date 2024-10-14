// auth.server.ts
import { redirect } from "@remix-run/node";
import { createCookie } from "@remix-run/node"; // For cookie creation
// import { getConfig } from "~/config"; // Assuming you have this for getting your backend API URL
import { jwtDecode } from "jwt-decode";
import { parse } from "cookie"; // For parsing cookies

const COOKIE_TOKEN_KEY = "access_token";

export async function loginAuth(email: string, password: string) {
  if (!email || !password) {
    return redirect("/login", { status: 400 });
  }

  try {
    // Call the backend login API
    // const response = await fetch(`${getConfig().backendApiBaseUrl}/login`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email, password }),
    // });
    //
    // if (!response.ok) {
    //   return redirect("/login", { status: 401 });
    // }
    //
    // const result = await response.json();
    // const { access_token } = result.data;

    const access_token =
      "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzI4OTc4MDQwLCJpZCI6MSwibmFtZSI6ImFkbWluIiwidXNlcm5hbWUiOiJhZG1pbiIsImF2YXRhciI6IiIsInJvbGUiOiJhZG1pbiIsImNyZWF0ZWRfYXQiOiIyMDI0LTEwLTEyVDIxOjIwOjUzLjQwNzM4MSswODowMCIsInRva2VuX3R5cGUiOiJBQ0NFU1NfVE9LRU4ifQ.TA_xRESEOiaf5tV7pPFEuq1t_vM0f7bA2lF3kPj91rYVT_Pw6kpBNCnqGQpy1pgTRG4QAAfRTaIRPoFBkWixpw";

    // Set JWT as a cookie
    // const tokenCookie = createCookie(COOKIE_TOKEN_KEY, {
    //   maxAge: 60 * 60 * 24 * 7, // 1 week expiration
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Only secure in production
    //   sameSite: "lax",
    // });

    const headers = new Headers();
    // headers.append("Set-Cookie", await tokenCookie.serialize(access_token));
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

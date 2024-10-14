import { LoaderFunction } from "@remix-run/node";
import { logout } from "~/services/auth.server";

// Loader function to handle logout
export const loader: LoaderFunction = async ({ request }) => {
  // Call the logout function from auth.server.ts
  return logout(request);
};

// If you want to render something in case the user visits the logout route via a browser
export default function LogoutPage() {
  return null; // You don't need to render anything on the logout page
}

import { LoaderFunction, redirect } from "@remix-run/node";
import { getUserFromSession } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  // If the user is authenticated, redirect to the dashboard
  if (!user) {
    return redirect("/login");
  }

  return redirect("/console");
};

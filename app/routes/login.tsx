import { Button } from "~/components/ui/button";
import { LoaderFunction, redirect } from "@remix-run/node";
import { AiOutlineWechatWork } from "react-icons/ai";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Form } from "@remix-run/react";
import { useRef } from "react";
import { getUserFromSession, loginAuth } from "~/services/auth.server";

import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Call the loginAuth function
  return loginAuth(email, password);
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserFromSession(request);

  // If the user is authenticated, redirect to the dashboard
  if (user) {
    return redirect("/console");
  }
  return null;
};

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
// export async function loader({ request }: LoaderFunctionArgs) { }

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center">
      <Form method="post" className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login to GPU Cloud</h1>
          </div>
          <hr />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                ref={passwordRef}
                id="password"
                type="password"
                name="password"
                placeholder="password"
                required
              />
            </div>
            <div className="flex gap-2 items-center hidden">
              <Input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4"
              />{" "}
              <Label
                id="remember"
                htmlFor="checkbox"
                className="my-auto items-center"
              >
                {" "}
                Remember me{" "}
              </Label>
            </div>
            <Button className="w-full">Sign in</Button>
          </div>
          <div className="grid gap-4">
            <Button type="submit" className="w-full" variant="outline" disabled>
              <AiOutlineWechatWork size={22} className="mr-2" />
              {`Login With Wecom (Comming soon)`}
            </Button>
          </div>
          <div className="text-center text-sm">
            {`Don't have an account? Contact Lane or Aiden!`}
          </div>
        </div>
      </Form>
    </div>
  );
}

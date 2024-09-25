import { Button } from "~/components/ui/button";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { AiOutlineWechatWork } from "react-icons/ai";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Form } from "@remix-run/react";
import { useRef } from "react";
import { authenticator } from "~/services/auth.server";

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request }: ActionFunctionArgs) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
}

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export async function loader({ request }: LoaderFunctionArgs) {
  // If the user is already authenticated redirect to /dashboard directly
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });
}

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export default function Dashboard() {
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

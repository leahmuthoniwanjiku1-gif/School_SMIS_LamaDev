import { redirect } from "next/navigation";

// The custom sign-in page lives at the root [[...sign-in]] route.
// Redirect here so any link to /sign-in still works.
export default function SignInRedirect() {
  redirect("/");
}

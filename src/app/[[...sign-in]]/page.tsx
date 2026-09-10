import { auth } from "@/auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth();

  if (session?.user) {
    redirect(session.user.role ? `/${session.user.role}` : "/admin");
  }

  redirect("/sign-in");
};

export default LoginPage;

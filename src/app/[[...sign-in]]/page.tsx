"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // Role-based redirect after successful sign-in
  useEffect(() => {
    if (!isLoaded) return;

    const role = user?.publicMetadata?.role as string | undefined;

    if (isSignedIn && role) {
      router.push(`/${role}`);
    } else if (isSignedIn && !role) {
      // Signed in but no role assigned — send to root
      router.push("/");
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      <SignIn.Root>
        {/* Step: Enter credentials */}
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="SchooLama logo" width={24} height={24} />
            SchooLama
          </h1>
          <h2 className="text-gray-400 text-sm mb-2">Sign in to your account</h2>

          {/* Global Clerk errors (e.g. invalid credentials) */}
          <Clerk.GlobalError className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md" />

          {/* Username field */}
          <Clerk.Field name="identifier" className="flex flex-col gap-1">
            <Clerk.Label className="text-xs font-medium text-gray-500">
              Username
            </Clerk.Label>
            <Clerk.Input
              type="text"
              required
              className="p-2 rounded-md ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <Clerk.FieldError className="text-xs text-red-500" />
          </Clerk.Field>

          {/* Password field */}
          <Clerk.Field name="password" className="flex flex-col gap-1">
            <Clerk.Label className="text-xs font-medium text-gray-500">
              Password
            </Clerk.Label>
            <Clerk.Input
              type="password"
              required
              className="p-2 rounded-md ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <Clerk.FieldError className="text-xs text-red-500" />
          </Clerk.Field>

          {/* Submit button — shows loading spinner while Clerk is working */}
          <SignIn.Action submit asChild>
            <button className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors text-white mt-2 rounded-md text-sm p-[10px] font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              <Clerk.Loading>
                {(isLoading) =>
                  isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )
                }
              </Clerk.Loading>
            </button>
          </SignIn.Action>
        </SignIn.Step>

        {/* Step: MFA / verification (if enabled on the Clerk instance) */}
        <SignIn.Step
          name="verifications"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Image src="/logo.png" alt="SchooLama logo" width={24} height={24} />
            SchooLama
          </h1>
          <h2 className="text-gray-400 text-sm mb-2">Verify your identity</h2>

          <Clerk.GlobalError className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md" />

          <SignIn.Strategy name="email_code">
            <Clerk.Field name="code" className="flex flex-col gap-1">
              <Clerk.Label className="text-xs font-medium text-gray-500">
                Email verification code
              </Clerk.Label>
              <Clerk.Input
                type="otp"
                required
                className="p-2 rounded-md ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm tracking-widest"
              />
              <Clerk.FieldError className="text-xs text-red-500" />
            </Clerk.Field>

            <SignIn.Action submit asChild>
              <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-white mt-2 rounded-md text-sm p-[10px] font-medium flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                <Clerk.Loading>
                  {(isLoading) =>
                    isLoading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      "Verify"
                    )
                  }
                </Clerk.Loading>
              </button>
            </SignIn.Action>
          </SignIn.Strategy>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;

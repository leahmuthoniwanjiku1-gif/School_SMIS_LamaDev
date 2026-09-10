"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create account");
      }

      router.push("/sign-in");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">Create account</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
            <input
              value={form.name}
              onChange={(event) => handleChange("name", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-400"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Username</label>
            <input
              value={form.username}
              onChange={(event) => handleChange("username", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-400"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => handleChange("password", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-400"
              placeholder="Choose a password"
              minLength={8}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
            <select
              value={form.role}
              onChange={(event) => handleChange("role", event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-400"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="PARENT">Parent</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link href="/sign-in" className="text-blue-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, Field, Input } from "@/components/customizeComponents";
import { useRequester } from "@/hooks/useRequester";
import { endpoints } from "@/lib/api/endpoints";
import { loginLocal, toSession, type LoginResponse } from "@/lib/auth";
import { setSession } from "@/store/authSlice";
import { useAppDispatch, useSession } from "@/store/hooks";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const session = useSession();
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Partial<typeof values>>({});

  const { reload: login, loading } = useRequester<LoginResponse>({
    request: { endpoint: endpoints.auth.login },
    requestImmediately: false,
    doAfter: (data) => {
      dispatch(setSession(toSession(data)));
      router.replace("/");
    },
  });

  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Partial<typeof values> = {};
    if (!values.username.trim()) found.username = "Username is required";
    if (!values.password) found.password = "Password is required";
    setErrors(found);
    if (Object.keys(found).length) return;
    const local = await loginLocal(values.username, values.password);
    if (local) {
      dispatch(setSession(local));
      router.replace("/");
      return;
    }
    void login({ body: { username: values.username.trim(), password: values.password, expiresInMins: 30 } });
  }

  return (
    <Card className="w-full max-w-sm p-6">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
          D
        </span>
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Welcome back to your dashboard.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field label="Username" htmlFor="username" error={errors.username}>
          <Input
            id="username"
            autoComplete="username"
            value={values.username}
            aria-invalid={Boolean(errors.username)}
            onChange={(e) => setValues((v) => ({ ...v, username: e.target.value }))}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            aria-invalid={Boolean(errors.password)}
            onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          />
        </Field>
        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <Link
        href="/register"
        className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg border border-border text-sm font-medium hover:bg-surface-muted"
      >
        Register
      </Link>
      <p className="mt-4 text-center text-xs text-muted">
        <Link href="/dev" className="font-medium text-primary hover:underline">
          About this project
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-muted">
        Demo account: <span className="font-medium text-foreground">gouda</span> / <span className="font-medium text-foreground">goudapass</span>
      </p>
    </Card>
  );
}

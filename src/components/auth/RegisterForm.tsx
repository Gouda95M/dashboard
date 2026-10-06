"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, Card, Field, Input } from "@/components/customizeComponents";
import { useRequester } from "@/hooks/useRequester";
import { endpoints } from "@/lib/api/endpoints";
import { localUsernameTaken, saveLocalAccount } from "@/lib/auth";
import { notify } from "@/lib/notifications";

const initial = { firstName: "", lastName: "", email: "", username: "", password: "" };
type Values = typeof initial;

const fields: { name: keyof Values; label: string; type?: string; autoComplete: string }[] = [
  { name: "firstName", label: "First name", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", autoComplete: "family-name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "username", label: "Username", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
];

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Partial<Values>>({});

  const { reload: register, loading } = useRequester<{ id: number }>({
    request: { endpoint: endpoints.users.add },
    requestImmediately: false,
    doAfter: async (created: { id: number }) => {
      await saveLocalAccount(
        {
          id: created.id,
          username: values.username.trim(),
          email: values.email.trim(),
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
        },
        values.password,
      );
      notify.success("Account created", { description: "You can now sign in." });
      router.replace("/login");
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const found: Partial<Values> = {};
    for (const f of fields) if (!values[f.name].trim()) found[f.name] = `${f.label} is required`;
    if (!found.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) found.email = "Enter a valid email";
    if (!found.username && localUsernameTaken(values.username)) found.username = "Username is already taken";
    if (!found.password && values.password.length < 6) found.password = "Must be at least 6 characters";
    setErrors(found);
    if (Object.keys(found).length) return;
    void register({
      body: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        username: values.username.trim(),
        password: values.password,
      },
    });
  }

  return (
    <Card className="w-full max-w-sm p-6">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary text-lg font-semibold text-primary-foreground">
          D
        </span>
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-muted">Register to get started.</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {fields.map((f) => (
          <Field key={f.name} label={f.label} htmlFor={f.name} error={errors[f.name]}>
            <Input
              id={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              value={values[f.name]}
              aria-invalid={Boolean(errors[f.name])}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            />
          </Field>
        ))}
        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in · Dashboard" };

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <LoginForm />
    </main>
  );
}

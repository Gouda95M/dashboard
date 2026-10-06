import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = { title: "Register · Dashboard" };

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center p-4">
      <RegisterForm />
    </main>
  );
}

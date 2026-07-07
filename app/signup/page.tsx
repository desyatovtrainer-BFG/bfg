import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { AuthShell } from "../components/auth/auth-shell";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Регистрация — BFG",
};

export default async function SignupPage() {
  if (await getCurrentUser()) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="Создай профиль"
      subtitle="Аккаунт сохранит твой путь и прогресс."
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-semibold text-sky-400 hover:text-sky-300">
            Войти
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}

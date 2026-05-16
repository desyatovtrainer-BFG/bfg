import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { AuthShell } from "../components/auth/auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Вход — BFG",
};

export default async function LoginPage() {
  if (await getCurrentUser()) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      title="С возвращением"
      subtitle="Войди, чтобы продолжить эволюцию."
      footer={
        <>
          Ещё нет аккаунта?{" "}
          <Link href="/signup" className="font-semibold text-sky-400 hover:text-sky-300">
            Создать
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}

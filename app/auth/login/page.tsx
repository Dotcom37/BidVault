import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-6">
        <span className="text-sm font-semibold tracking-tight">
          BidVault
        </span>

        <a
          href="/auth/signup"
          className="rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white"
        >
          Sign up
        </a>
      </nav>

      <div className="flex justify-center px-6 py-12">
        <LoginForm />
      </div>
    </main>
  );
}
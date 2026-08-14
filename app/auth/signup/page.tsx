import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-6">
        <span className="text-sm font-semibold tracking-tight">
          BidVault
        </span>

        <a
          href="/auth/login"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          Log in
        </a>
      </nav>

      <div className="flex justify-center px-6 py-12">
        <SignupForm />
      </div>
    </main>
  );
}
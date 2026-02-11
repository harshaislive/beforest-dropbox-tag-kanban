import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <AuthForm />
        <p className="text-center text-sm text-slate-600">
          New here? <Link className="underline" href="/auth/signup">Create account</Link>
        </p>
      </div>
    </main>
  );
}

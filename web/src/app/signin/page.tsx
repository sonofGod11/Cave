"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier } from "firebase/auth";

export default function SignIn() {
  const { signInEmail, signInPhone, user, loading } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [form, setForm] = useState({ email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && !loading) router.push("/dashboard");
  }, [user, loading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    if (method === 'email') {
      if (form.password.length < 6) { setSubmitting(false); return setError('Password must be at least 6 characters.'); }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) { setSubmitting(false); return setError('Enter a valid email.'); }
      try {
        await signInEmail(form.email, form.password);
        setSuccess('Signed in!');
      } catch (err: any) {
        setError(err.message);
      }
      setSubmitting(false);
    } else {
      // Phone auth
      if (!/^\d{10,}$/.test(form.phone)) { setSubmitting(false); return setError('Enter a valid phone number.'); }
      setVerifying(true);
      setSubmitting(true);
      try {
        if (!(window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {},
          });
        }
        const appVerifier = (window as any).recaptchaVerifier;
        const confirmationResult = await signInPhone("+233" + form.phone.slice(1), appVerifier);
        setConfirmation(confirmationResult);
        setSuccess('Code sent! Enter the code to verify.');
      } catch (err: any) {
        setError(err.message);
      }
      setVerifying(false);
      setSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!confirmation) return setError('No confirmation found.');
    try {
      await confirmation.confirm(form.password);
      setSuccess('Phone verified and signed in!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400/20 to-orange-200/20 px-4">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/30 mt-16">
        <h1 className="text-3xl font-bold text-center mb-6 text-[var(--color-primary)] drop-shadow">Sign In</h1>
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => setMethod('email')} className={`px-4 py-2 rounded-lg font-semibold transition-all ${method==='email' ? 'bg-[var(--color-primary)] text-white' : 'bg-white/70 text-blue-700'}`}>Email</button>
          <button onClick={() => setMethod('phone')} className={`px-4 py-2 rounded-lg font-semibold transition-all ${method==='phone' ? 'bg-[var(--color-primary)] text-white' : 'bg-white/70 text-blue-700'}`}>Phone</button>
        </div>
        {method === 'email' ? (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <input type="email" name="email" placeholder="Enter your email address" value={form.email} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">e.g. demo@example.com</div>
            </div>
            <div>
              <input type="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">Minimum 6 characters</div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button type="submit" className="mt-2 px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all" disabled={submitting}>
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          confirmation && (
            <form className="flex flex-col gap-4" onSubmit={handleVerify}>
              <div>
                <input type="text" name="password" placeholder="Enter SMS code" value={form.password} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
                <div className="text-xs text-gray-600 mt-1 ml-1">Check your phone for the code</div>
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-600 text-sm text-center">{success}</div>}
              <button type="submit" className="mt-2 px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all" disabled={verifying}>
                {verifying ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            </form>
          )
        )}
        <div id="recaptcha-container"></div>
        <div className="text-center mt-4 text-white/80">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[var(--color-primary)] font-semibold hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
} 
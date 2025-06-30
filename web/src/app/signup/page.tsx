"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const { signUpEmail, signInPhone, user, loading } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [form, setForm] = useState({ email: '', phone: '', password: '', confirm: '', code: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [confirmation, setConfirmation] = useState<any>(null);

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
    setError('');
    setSuccess('');
    if (method === 'email') {
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
      if (form.password !== form.confirm) return setError('Passwords do not match.');
      try {
        await signUpEmail(form.email, form.password);
        setSuccess('Account created! Redirecting...');
      } catch (err: any) {
        setError(err.message);
      }
    } else {
      // Phone auth
      if (!/^\d{10,}$/.test(form.phone)) return setError('Enter a valid phone number.');
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
      if (form.password !== form.confirm) return setError('Passwords do not match.');
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
        setStep('verify');
        setSuccess('Code sent! Enter the code to verify.');
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!confirmation) return setError('No confirmation found.');
    try {
      await confirmation.confirm(form.code);
      setSuccess('Phone verified and account created! Redirecting...');
      setStep('form');
      setForm({ email: '', phone: '', password: '', confirm: '', code: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400/20 to-orange-200/20 px-4">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/30 mt-16">
        <h1 className="text-3xl font-bold text-center mb-6 text-[var(--color-primary)] drop-shadow">Sign Up</h1>
        <div className="flex justify-center gap-4 mb-6">
          <button onClick={() => { setMethod('email'); setStep('form'); }} className={`px-4 py-2 rounded-lg font-semibold transition-all ${method==='email' ? 'bg-[var(--color-primary)] text-white' : 'bg-white/70 text-blue-700'}`}>Email</button>
          <button onClick={() => { setMethod('phone'); setStep('form'); }} className={`px-4 py-2 rounded-lg font-semibold transition-all ${method==='phone' ? 'bg-[var(--color-primary)] text-white' : 'bg-white/70 text-blue-700'}`}>Phone</button>
        </div>
        {method === 'email' && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <input type="email" name="email" placeholder="Enter a valid email address" value={form.email} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">e.g. demo@example.com</div>
            </div>
            <div>
              <input type="password" name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">Minimum 6 characters</div>
            </div>
            <div>
              <input type="password" name="confirm" placeholder="Must match password" value={form.confirm} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">Repeat your password</div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button type="submit" className="mt-2 px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all">Create Account</button>
          </form>
        )}
        {method === 'phone' && step === 'form' && (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <input type="tel" name="phone" placeholder="Enter a valid phone number (e.g. 024XXXXXXX)" value={form.phone} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">10 digits, e.g. 0241234567</div>
            </div>
            <div>
              <input type="password" name="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">Minimum 6 characters</div>
            </div>
            <div>
              <input type="password" name="confirm" placeholder="Must match password" value={form.confirm} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">Repeat your password</div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button type="submit" className="mt-2 px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all">Send Code</button>
            <div id="recaptcha-container"></div>
          </form>
        )}
        {method === 'phone' && step === 'verify' && (
          <form className="flex flex-col gap-4" onSubmit={handleVerify}>
            <div>
              <input type="text" name="code" placeholder="Enter SMS code" value={form.code} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full text-gray-900 placeholder-gray-500" required />
              <div className="text-xs text-gray-600 mt-1 ml-1">Check your phone for the code</div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center">{success}</div>}
            <button type="submit" className="mt-2 px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all">Verify & Create Account</button>
          </form>
        )}
        <div className="text-center mt-4 text-white/80">
          Already have an account?{' '}
          <Link href="/signin" className="text-[var(--color-primary)] font-semibold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
} 
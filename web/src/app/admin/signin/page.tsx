"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthProvider";

export default function AdminSignIn() {
  const { signInEmail, user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && !loading) router.push("/admin");
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
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return setError('Enter a valid email.');
    try {
      await signInEmail(form.email, form.password);
      setSuccess('Signed in!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-400/20 to-green-200/20 px-4">
      <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/30 mt-16">
        <h1 className="text-3xl font-bold text-center mb-6 text-orange-600 drop-shadow">Admin Sign In</h1>
        <div className="text-center text-red-600 font-semibold mb-4">For authorized personnel only</div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Admin email address" value={form.email} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full text-gray-900 placeholder-gray-500" required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="px-4 py-3 rounded-lg bg-white/90 border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 w-full text-gray-900 placeholder-gray-500" required />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" className="mt-2 px-6 py-3 rounded-lg font-bold bg-orange-500 text-white shadow-lg hover:bg-orange-600 transition-all">Sign In</button>
        </form>
      </div>
    </div>
  );
} 
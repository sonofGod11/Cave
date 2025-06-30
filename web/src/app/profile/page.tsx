"use client";
import { useState, useRef } from "react";
import { useAuth } from "../AuthProvider";
import { updateEmail, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification, updateProfile, deleteUser } from "firebase/auth";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

const mockMethods = [
  { id: 1, type: "Card", details: "**** 1234", name: "Ama Boateng" },
  { id: 2, type: "Mobile Money", details: "024****567", name: "Ama Boateng" },
];

const mockLoginHistory = [
  { date: "2024-06-25 09:12", device: "Chrome on Windows", location: "Accra, Ghana" },
  { date: "2024-06-24 18:45", device: "Safari on iPhone", location: "Kumasi, Ghana" },
  { date: "2024-06-23 07:30", device: "Edge on Windows", location: "Takoradi, Ghana" },
];

export default function Profile() {
  const { user, loading, resendEmailVerification } = useAuth();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [avatar, setAvatar] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [methods, setMethods] = useState(mockMethods);
  const [showAdd, setShowAdd] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: "Card", details: "", name: "" });
  const [methodError, setMethodError] = useState("");
  const [showSecurity, setShowSecurity] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityMsg, setSecurityMsg] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState("");

  // Initialize form with real user data
  React.useEffect(() => {
    if (user) {
      setForm({
        name: user.displayName || "",
        email: user.email || "",
        phone: "", // Fetch from Firestore if needed
        password: ""
      });
      setAvatar(user.photoURL || `https://ui-avatars.com/api/?name=${(user.displayName || "User").replace(/ /g, "+")}&background=3B82F6&color=fff&size=128`);
    }
  }, [user]);

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess("") , 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError("") , 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };
  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      setAvatarUploading(true);
      const file = e.target.files[0];
      const storageRef = ref(storage, `avatars/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        null,
        (error) => {
          setError('Upload failed: ' + error.message);
          setAvatarUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setAvatar(url);
          await updateProfile(user, { photoURL: url });
          await updateDoc(doc(db, "users", user.uid), { photoURL: url });
          setAvatarUploading(false);
          setSuccess('Avatar updated!');
        }
      );
    }
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (!form.name || !form.email || !form.phone) { setSaving(false); return setError("All fields are required."); }
    if (form.password && form.password.length < 6) { setSaving(false); return setError("Password must be at least 6 characters."); }
    
    try {
      if (user) {
        // Update Firebase profile
        await updateProfile(user, { displayName: form.name });
        
        // Update Firestore document
        await updateDoc(doc(db, "users", user.uid), {
          displayName: form.name,
          email: form.email,
          phone: form.phone
        });
        
        setEdit(false);
        setSuccess("Profile updated successfully!");
      }
    } catch (err: any) {
      setError("Failed to update profile: " + err.message);
    }
    setSaving(false);
  };
  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.displayName || "",
        email: user.email || "",
        phone: "",
        password: ""
      });
      setAvatar(user.photoURL || `https://ui-avatars.com/api/?name=${(user.displayName || "User").replace(/ /g, "+")}&background=3B82F6&color=fff&size=128`);
    }
    setEdit(false);
    setError("");
    setSuccess("");
  };
  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethod.details || !newMethod.name) return setMethodError("All fields are required.");
    setMethods([...methods, { ...newMethod, id: Date.now() }]);
    setShowAdd(false);
    setNewMethod({ type: "Card", details: "", name: "" });
    setMethodError("");
  };
  const handleRemoveMethod = (id: number) => {
    setMethods(methods.filter(m => m.id !== id));
  };
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPassword(true);
    setSecurityMsg("");
    if (!currentPassword || !newPassword || !confirmPassword) { setChangingPassword(false); return setSecurityMsg("All fields are required."); }
    if (newPassword.length < 6) { setChangingPassword(false); return setSecurityMsg("New password must be at least 6 characters."); }
    if (!strongPassword(newPassword)) { setChangingPassword(false); return setSecurityMsg("Password must be at least 8 characters, include uppercase, lowercase, number, and special character."); }
    if (newPassword !== confirmPassword) { setChangingPassword(false); return setSecurityMsg("Passwords do not match."); }
    setSecurityMsg("Password changed! (Mock)");
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setChangingPassword(false);
  };

  const strongPassword = (pw: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pw);

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    setDeleting(true);
    setError("");
    setSuccess("");
    try {
      await deleteUser(user);
      await updateDoc(doc(db, "users", user.uid), { deleted: true }); // Optionally mark as deleted
      setSuccess("Account deleted. Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
    setDeleting(false);
  };

  if (loading || !user) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100/40 to-orange-100/30 p-8">
      <div className="w-full max-w-lg bg-white/60 rounded-xl shadow p-8 flex flex-col items-center">
        {/* User Info Summary */}
        <div className="w-full flex flex-col items-center mb-8 p-4 rounded-xl bg-white/90 shadow border border-green-100">
          <img src={avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-[var(--color-primary)] object-cover mb-2" />
          <div className="font-bold text-lg text-gray-900">{user.displayName || user.email}</div>
          <div className="text-gray-600 text-sm mb-1">{user.email}</div>
          <div className="text-gray-600 text-sm mb-1">{form.phone || <span className='italic text-gray-400'>No phone</span>}</div>
          <div className="flex items-center gap-2 mt-2">
            {user.emailVerified ? (
              <span className="text-green-600 font-semibold">Email Verified</span>
            ) : (
              <>
                <span className="text-yellow-600 font-semibold">Email Not Verified</span>
                <button
                  className="px-3 py-1 rounded bg-yellow-500 text-white text-xs font-bold ml-2 disabled:opacity-60"
                  onClick={async () => { setResendError(""); setResent(false); try { await resendEmailVerification(); setResent(true); } catch (e: any) { setResendError(e.message); } }}
                  disabled={resent}
                >
                  {resent ? "Verification Sent!" : "Resend Email"}
                </button>
                {resendError && <span className="text-red-500 text-xs ml-2">{resendError}</span>}
              </>
            )}
          </div>
        </div>
        <div className="mb-6 relative">
          <img src={avatar} alt="avatar" className="w-28 h-28 rounded-full border-4 border-[var(--color-primary)] object-cover" />
          {avatarUploading && <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full"><span className="text-[var(--color-primary)] font-bold">Uploading...</span></div>}
          {edit && (
            <button onClick={() => fileInput.current?.click()} className="absolute bottom-2 right-2 bg-[var(--color-primary)] text-white p-2 rounded-full shadow hover:bg-blue-700 transition-all">
              <span role="img" aria-label="edit">✏️</span>
            </button>
          )}
          <input type="file" accept="image/*" ref={fileInput} className="hidden" onChange={handleAvatar} />
        </div>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSave}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} disabled={!edit} className="w-full px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} disabled={!edit} className="w-full px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} disabled={!edit} className="w-full px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} disabled={!edit} placeholder="Leave blank to keep current password" className="w-full px-4 py-3 rounded-lg bg-white/90 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
            <div className="text-xs text-gray-500 mt-1">Minimum 6 characters if changing password</div>
          </div>
          {error && (
            <div className="flex items-center justify-center gap-2 bg-red-100 border border-red-300 text-red-700 rounded-lg px-4 py-2 text-sm font-semibold mb-2 animate-fade-in">
              <span role="img" aria-label="error">❌</span> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center gap-2 bg-green-100 border border-green-300 text-green-700 rounded-lg px-4 py-2 text-sm font-semibold mb-2 animate-fade-in">
              <span role="img" aria-label="success">✅</span> {success}
            </div>
          )}
          <div className="flex gap-4 mt-4 justify-center">
            {edit ? (
              <>
                <button type="submit" className="px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={handleCancel} className="px-6 py-3 rounded-lg font-bold bg-gray-200 text-gray-700 shadow hover:bg-gray-300 transition-all">Cancel</button>
                <button type="button" onClick={handleDeleteAccount} className="px-6 py-3 rounded-lg font-bold bg-red-500 text-white shadow hover:bg-red-700 transition-all" disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Account'}</button>
              </>
            ) : (
              <button type="button" onClick={() => setEdit(true)} className="px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all">Edit Profile</button>
            )}
          </div>
        </form>
        <div className="w-full mt-10">
          <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">Payment Methods</h2>
          <div className="flex flex-col gap-4 mb-4">
            {methods.length === 0 && <div className="text-gray-500">No payment methods added yet.</div>}
            {methods.map(m => (
              <div key={m.id} className="flex items-center justify-between bg-white/90 rounded-lg px-4 py-3 shadow">
                <div>
                  <span className="font-semibold text-gray-700 mr-2">{m.type}:</span>
                  <span className="text-gray-800">{m.details}</span>
                  <span className="ml-2 text-gray-500 text-sm">{m.name}</span>
                </div>
                <button onClick={() => handleRemoveMethod(m.id)} className="text-red-500 font-bold hover:underline ml-4">Remove</button>
              </div>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg font-semibold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all">Add Payment Method</button>
        </div>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button onClick={() => setShowAdd(false)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
              <h3 className="text-xl font-bold mb-4 text-[var(--color-primary)]">Add Payment Method</h3>
              <form className="flex flex-col gap-4" onSubmit={handleAddMethod}>
                <select value={newMethod.type} onChange={e => setNewMethod(n => ({ ...n, type: e.target.value }))} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900">
                  <option>Card</option>
                  <option>Mobile Money</option>
                  <option>Bank</option>
                </select>
                <input type="text" placeholder={newMethod.type === 'Card' ? 'Card Number (**** 1234)' : newMethod.type === 'Mobile Money' ? 'Phone Number (024****567)' : 'Account Number'} value={newMethod.details} onChange={e => setNewMethod(n => ({ ...n, details: e.target.value }))} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                <input type="text" placeholder="Account Holder Name" value={newMethod.name} onChange={e => setNewMethod(n => ({ ...n, name: e.target.value }))} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                {methodError && <div className="text-red-500 text-sm text-center">{methodError}</div>}
                <button type="submit" className="px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all">Add</button>
              </form>
            </div>
          </div>
        )}
        <div className="w-full mt-10">
          <h2 className="text-xl font-bold text-[var(--color-primary)] mb-4">Security & Settings</h2>
          <div className="flex flex-col gap-4 mb-4">
            <button onClick={() => setShowSecurity(v => !v)} className="px-4 py-2 rounded-lg font-semibold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all w-fit">{showSecurity ? 'Hide' : 'Show'} Security Settings</button>
            {showSecurity && (
              <div className="bg-white/90 rounded-lg p-6 shadow flex flex-col gap-6">
                <form className="flex flex-col gap-3" onSubmit={handleChangePassword}>
                  <div className="font-semibold text-gray-700 mb-1">Change Password</div>
                  <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                  <input type="password" placeholder="New Password (min 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                  <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                  <button type="submit" className="mt-2 px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all" disabled={changingPassword}>{changingPassword ? 'Changing...' : 'Change Password'}</button>
                  {securityMsg && <div className="text-green-600 text-sm text-center mt-2">{securityMsg}</div>}
                </form>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={twoFA} onChange={e => setTwoFA(e.target.checked)} id="2fa" className="w-5 h-5" />
                  <label htmlFor="2fa" className="font-semibold text-gray-700">Enable Two-Factor Authentication (2FA)</label>
                  <span className="text-xs text-gray-500">(Mock toggle)</span>
                </div>
                <div className="font-semibold text-gray-700 mb-1">Notification Preferences</div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)} className="w-5 h-5" />
                    <span>Email</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={notifySMS} onChange={e => setNotifySMS(e.target.checked)} className="w-5 h-5" />
                    <span>SMS</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full mt-10">
          <h2 className="text-xl font-bold text-green-700 mb-4">Login History</h2>
          <div className="bg-white rounded-xl shadow p-4 border border-green-100">
            <table className="w-full text-left">
              <thead>
                <tr className="text-green-700 font-semibold">
                  <th className="pb-2">Date & Time</th>
                  <th className="pb-2">Device</th>
                  <th className="pb-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {mockLoginHistory.map((l, i) => (
                  <tr key={i} className="border-t border-green-50">
                    <td className="py-2">{l.date}</td>
                    <td>{l.device}</td>
                    <td>{l.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPhoneNumber,
  User,
  sendEmailVerification,
  ConfirmationResult,
  ApplicationVerifier
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
  signUpEmail: (email: string, password: string) => Promise<unknown>;
  signInEmail: (email: string, password: string) => Promise<unknown>;
  signOut: () => Promise<void>;
  signInPhone: (phone: string, appVerifier: ApplicationVerifier) => Promise<ConfirmationResult>;
  resendEmailVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", u.uid));
        setRole(userDoc.exists() ? userDoc.data().role || "user" : "user");
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signUpEmail = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Create user doc with default role 'user'
    await setDoc(doc(db, "users", cred.user.uid), {
      email: cred.user.email,
      role: "user",
      createdAt: new Date().toISOString(),
    });
    return cred;
  };
  const signInEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
  const signOut = () => firebaseSignOut(auth);
  const signInPhone = (phone: string, appVerifier: ApplicationVerifier) =>
    signInWithPhoneNumber(auth, phone, appVerifier);

  const resendEmailVerification = async () => {
    if (!auth.currentUser) throw new Error("No user is currently signed in");
    await sendEmailVerification(auth.currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, signUpEmail, signInEmail, signOut, signInPhone, resendEmailVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
} 
"use client";
import { AuthProvider } from "./AuthProvider";
import HelpWidget from "./HelpWidget";

export default function RootClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HelpWidget />
      {children}
    </AuthProvider>
  );
} 
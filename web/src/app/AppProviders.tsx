"use client";
import { AuthProvider } from "./AuthProvider";
import HelpWidget from "./HelpWidget";
import { createContext, useContext } from "react";

// Mock role context for future use (can be removed if not needed)
export const RoleContext = createContext("user");
export function useRole() {
  return useContext(RoleContext);
}

export default function AppProviders({ children }: { children: React.ReactNode }) {
  // Set role here if needed (for now, not used since real role comes from AuthProvider)
  const role = "user";
  return (
    <RoleContext.Provider value={role}>
      <AuthProvider>
        {children}
        <HelpWidget />
      </AuthProvider>
    </RoleContext.Provider>
  );
} 
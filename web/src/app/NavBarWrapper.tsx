"use client";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

const publicRoutes = [
  "/", "/about", "/services", "/faq", "/terms", "/privacy", "/support", "/learn"
];

export default function NavBarWrapper() {
  const pathname = usePathname();
  const showNavBar = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
  return showNavBar ? <NavBar /> : null;
} 
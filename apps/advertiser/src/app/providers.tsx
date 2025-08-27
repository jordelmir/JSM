"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@gasolinera-jsm/shared/store/authStore";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PROTECTED_ROUTES } from '@/lib/protectedRoutes'; // Import protected routes
import { toast } from 'react-toastify'; // Import toast

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout); // Assuming logout action in your store

  useEffect(() => {
    // The primary authentication check is now handled by server-side middleware (src/middleware.ts)
    // If a user tries to access a protected route without an HttpOnly cookie, the middleware will redirect them.

    // This client-side logic will now primarily handle redirection for already authenticated users
    // trying to access the login page.
    if (pathname === '/login' && token) { // token here would come from in-memory store, not persisted
      toast.info("You are already logged in."); // User feedback
      router.push('/dashboard');
    }
  }, [token, pathname, router, logout]); // Add logout to dependencies

  return (
    <>
      {children}
      <ToastContainer position="bottom-right" />
    </>
  );
}

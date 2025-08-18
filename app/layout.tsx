import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Evently",
  description: "Add and manage your events easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider> <body className="relative">
              <ToastContainer position="top-center" autoClose={3000} />

        <main className="relative z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50">{children}</main>
      </body></ClerkProvider>

    </html>
  );
}

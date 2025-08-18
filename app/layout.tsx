import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Event Manager",
  description: "Add and manage your events easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <body className="relative">
        <main className="relative z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50">{children}</main>
      </body>
    </html>
  );
}

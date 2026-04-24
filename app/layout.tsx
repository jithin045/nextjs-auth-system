import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Auth System",
  description: "Next.js + Firebase Auth system",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#f5f5f5",
          margin: 0,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
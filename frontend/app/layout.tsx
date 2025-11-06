import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fritz Automation - Joshua Fritzjunker | Software Developer",
  description: "Fritz Automation specializes in process automation, system integration, and custom software solutions. Expert backend development with Python and modern web technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

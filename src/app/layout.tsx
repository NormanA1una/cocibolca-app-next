import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Licorería Cocibolca",
  description:
    "App de administraciónd de proveedores e inventario de productos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <NextAuthProvider>
        <body className={`${inter.className} bg-backgroundViolet`}>
          {children}
        </body>
      </NextAuthProvider>
    </html>
  );
}

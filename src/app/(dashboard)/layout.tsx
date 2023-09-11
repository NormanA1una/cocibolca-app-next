import HamburguerMenu from "@/components/HamburguerMenu/HamburguerMenu";
import SideNav from "@/components/SideNav/SideNav";
import { NextAuthProvider } from "../AuthProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row justify-start max-md:flex-col h-screen">
      <NextAuthProvider>
        <SideNav />
        <HamburguerMenu />
        {children}
      </NextAuthProvider>
    </section>
  );
}

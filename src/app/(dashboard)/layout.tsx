import HamburguerMenu from "@/components/HamburguerMenu/HamburguerMenu";
import SideNav from "@/components/SideNav/SideNav";
import { NextAuthProvider } from "../AuthProvider";
import NavBar from "@/components/NavBar/NavBar";

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
        <div className="w-full flex flex-col">
          <NavBar />
          {children}
        </div>
      </NextAuthProvider>
    </section>
  );
}

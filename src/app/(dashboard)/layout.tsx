import HamburguerMenu from "@/components/HamburguerMenu/HamburguerMenu";
import SideNav from "@/components/SideNav/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row justify-start max-md:flex-col h-screen">
      <SideNav />
      <HamburguerMenu />
      {children}
    </section>
  );
}

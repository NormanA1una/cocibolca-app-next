import HamburguerMenu from "@/components/HamburguerMenu/HamburguerMenu";
import SideNav from "@/components/SideNav/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex max-md:flex-col">
      <SideNav />
      <HamburguerMenu />
      {children}
    </section>
  );
}

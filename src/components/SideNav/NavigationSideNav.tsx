import { NavLinks } from "../../app/NavLinks";
import { usePathname } from "next/navigation";
import { Sidebar } from "flowbite-react";

export default function NavigationSideNav() {
  const pathname = usePathname();

  return (
    <>
      {NavLinks.map((link) => {
        const isActive = pathname === link.pathname;

        return (
          <Sidebar.Item
            key={link.name}
            href={link.pathname}
            icon={link.icon}
            className={
              isActive
                ? " text-blue-400 flex items-center gap-1"
                : " text-neutral-950 flex items-center gap-1"
            }
          >
            <p>{link.name}</p>
          </Sidebar.Item>
        );
      })}
    </>
  );
}

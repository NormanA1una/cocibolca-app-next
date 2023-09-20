import { NavLinks } from "../../app/NavLinks";
import { usePathname } from "next/navigation";
import { Sidebar } from "flowbite-react";
import { useSession } from "next-auth/react";

export default function NavigationSideNav() {
  const { data: session, status } = useSession();

  const pathname = usePathname();

  const filterNavlinks: NavLinksTypes[] = [];

  NavLinks.forEach((item) => {
    if (session?.user.rol[0] !== "Usuario") {
      filterNavlinks.push(item);

      return filterNavlinks;
    } else if (session?.user.rol[0] === "Usuario" && item.name !== "Usuarios") {
      filterNavlinks.push(item);

      return filterNavlinks;
    }
  });

  return (
    <>
      {filterNavlinks.map((link) => {
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

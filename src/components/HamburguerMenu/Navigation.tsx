import Link from "next/link";
import { NavLinks } from "../../app/NavLinks";
import { usePathname } from "next/navigation";

export default function Navigation({
  closeNav,
}: {
  closeNav: CloseNavFunction;
}) {
  const pathname = usePathname();

  return (
    <>
      {NavLinks.map((link) => {
        const isActive = pathname === link.pathname;

        return (
          <li key={link.name}>
            <Link
              onClick={() => {
                closeNav(false);
              }}
              className={
                isActive
                  ? " text-blue-400 flex items-center gap-1"
                  : " text-neutral-950 flex items-center gap-1"
              }
              href={link.pathname}
            >
              {link.name}
            </Link>
          </li>
        );
      })}
    </>
  );
}

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
      {NavLinks.map(({ name, pathname: linkPathname }) => {
        const isActive = pathname === linkPathname;

        return (
          <li key={name}>
            <Link
              onClick={() => {
                closeNav(false);
              }}
              className={
                isActive
                  ? " text-neutralWhite flex items-center gap-1"
                  : " text-neutralBlack flex items-center gap-1"
              }
              href={linkPathname}
            >
              {name}
            </Link>
          </li>
        );
      })}
    </>
  );
}

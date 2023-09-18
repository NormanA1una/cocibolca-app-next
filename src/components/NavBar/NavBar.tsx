"use client";

import { Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const { data: session } = useSession() as any;

  return (
    <Navbar fluid rounded className="w-full max-md:hidden rounded-none p-6">
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-3xl font-semibold dark:text-white">
          Licorería Cocibolca
        </span>
      </Navbar.Brand>
      <span className="flex-1"></span>

      <h1 className="font-normal text-xl">
        Bienvenido{" "}
        <span className="font-bold">
          {session?.user?.username || sessionStorage.getItem("lobbyName")}
        </span>
      </h1>

      <Dropdown inline label="">
        <Dropdown.Item
          className=" w-[285px] justify-center text-red-700"
          onClick={() => {
            sessionStorage.removeItem("lobbyName");
            signOut({
              callbackUrl: "/",
            });
          }}
        >
          Cerrar Sesión{" "}
          <FontAwesomeIcon
            icon={faRightFromBracket}
            rotation={180}
            className="ml-2"
          />
        </Dropdown.Item>
      </Dropdown>
    </Navbar>
  );
}

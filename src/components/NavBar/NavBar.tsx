"use client";

import { Dropdown, Navbar } from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <Navbar
      fluid
      rounded
      className="fixed w-[calc(100vw-210px)] max-md:hidden rounded-none p-6 bg-[#D3BCF0]"
    >
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-3xl font-semibold dark:text-white">
          Licorería Cocibolca
        </span>
      </Navbar.Brand>
      <span className="flex-1"></span>

      {session?.user ? (
        <h1 className="font-normal text-xl flex items-center">
          Hola nuevamente,{" "}
          {
            <span className="font-bold ml-1">
              {session?.user?.username || sessionStorage.getItem("lobbyName")}
            </span>
          }
        </h1>
      ) : (
        <>
          <div
            role="status"
            className="w-[300px] ml-1 animate-pulse h-[15px] bg-gray-200 rounded-full dark:bg-gray-700"
          ></div>
        </>
      )}

      <Dropdown inline label="">
        <Dropdown.Item
          className=" w-[285px] justify-center text-red-700"
          onClick={() => {
            sessionStorage.removeItem("lobbyName");
            sessionStorage.removeItem("userRol");
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

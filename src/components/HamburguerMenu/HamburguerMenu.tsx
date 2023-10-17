"use client";

import { useState } from "react";
import Navigation from "./Navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function HamburguerMenu() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between border-b border-gray-400 py-4 px-2 md:hidden bg-[#9d4edd]">
      <div className="flex items-center">
        <Image
          src={"/licoreriaCocibolcaLogo.jpg"}
          width={100}
          height={100}
          alt="Logo Licorería Cocibolca"
          className="rounded-md mr-5 w-auto h-auto"
        />
        {session?.user ? (
          <h1 className="font-normal text-xl flex flex-col items-center text-neutralWhite">
            Hola nuevamente
            {
              <span className="font-bold">
                {session?.user?.username || sessionStorage.getItem("lobbyName")}
              </span>
            }
          </h1>
        ) : (
          <>
            <div
              role="status"
              className="w-[300px] animate-pulse h-[15px] bg-gray-200 rounded-full dark:bg-gray-700"
            ></div>
          </>
        )}
      </div>
      <nav className="mr-3">
        <section className="MOBILE-MENU flex lg:hidden">
          <div
            className="HAMBURGER-ICON space-y-2 border-2 p-2 rounded-md hover:bg-[#7b2cbf]"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-8 animate-pulse bg-neutralWhite"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-neutralWhite"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-neutralWhite"></span>
          </div>

          <div
            style={{ background: "#e0aaff" }}
            className={`${isNavOpen ? "showMenuNav" : "hideMenuNav"}`}
          >
            <div
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)}
            >
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
              <Navigation closeNav={setIsNavOpen} />

              <button
                className=" text-red-700"
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
              </button>
            </ul>
          </div>
        </section>
      </nav>
      <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
    </div>
  );
}

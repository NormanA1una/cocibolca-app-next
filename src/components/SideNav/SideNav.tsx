"use client";

import { Sidebar } from "flowbite-react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import NavigationSideNav from "./NavigationSideNav";

export default function SideNav() {
  return (
    <div>
      <Sidebar className="max-md:hidden" aria-label="Default sidebar example">
        <Sidebar.Items className="flex flex-col h-full">
          <Sidebar.ItemGroup>
            <NavigationSideNav />
          </Sidebar.ItemGroup>
          <span className="flex-1"></span>

          <Link href={"/"}>
            <button
              type="button"
              className=" bg-red-700 hover:bg-red-600 rounded-md p-3 mb-8 w-full text-neutral-50"
            >
              Cerrar sesión
            </button>
          </Link>
          <ul className="flex justify-around">
            <li>
              <Link
                href={
                  "https://www.facebook.com/norman.arandaluna?mibextid=2JQ9oc"
                }
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  size="2xl"
                  className=" text-blue-900"
                />
              </Link>
            </li>
            <li>
              <Link href={"https://github.com/NormanA1una"} target="_blank">
                <FontAwesomeIcon icon={faGithub} size="2xl" />
              </Link>
            </li>
            <li>
              <Link
                href={
                  "https://www.linkedin.com/in/norman-aranda-luna-7294a3285"
                }
                target="_blank"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  size="2xl"
                  className=" text-blue-500"
                />
              </Link>
            </li>
          </ul>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

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
import Image from "next/image";

import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite } from "flowbite-react";

const customTheme: CustomFlowbiteTheme = {
  sidebar: {
    root: {
      inner:
        "h-full overflow-y-auto overflow-x-hidden bg-[#A490CB] py-4 px-3 dark:bg-gray-800",
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-accentPurple dark:text-white dark:hover:bg-gray-700",
    },
  },
};

export default function SideNav() {
  return (
    <div className="flex fixed h-full">
      <Flowbite theme={{ theme: customTheme }}>
        <Sidebar
          className="max-md:hidden w-[210px] "
          aria-label="Default sidebar example"
        >
          <Sidebar.Items className="flex flex-col h-full">
            <Image
              src={"/licoreriaCocibolcaLogo.jpg"}
              width={180}
              height={180}
              alt="Logo Licorería Cocibolca"
              className="mx-auto rounded-md"
            />
            <Sidebar.ItemGroup>
              <NavigationSideNav />
            </Sidebar.ItemGroup>
            <span className="flex-1"></span>

            <ul className="flex justify-around">
              <li className="hover:bg-accentPurple p-2.5 rounded-full">
                <Link
                  href={
                    "https://www.facebook.com/norman.arandaluna?mibextid=2JQ9oc"
                  }
                  target="_blank"
                >
                  <FontAwesomeIcon
                    icon={faFacebook}
                    size="2xl"
                    className=" text-blue-900 hover:text-neutralBlack"
                  />
                </Link>
              </li>
              <li className="hover:bg-accentPurple p-2.5 rounded-full">
                <Link href={"https://github.com/NormanA1una"} target="_blank">
                  <FontAwesomeIcon icon={faGithub} size="2xl" />
                </Link>
              </li>
              <li className="hover:bg-accentPurple p-2.5 rounded-full">
                <Link
                  href={
                    "https://www.linkedin.com/in/norman-aranda-luna-7294a3285"
                  }
                  target="_blank"
                >
                  <FontAwesomeIcon
                    icon={faLinkedin}
                    size="2xl"
                    className=" text-blue-700 hover:text-neutralBlack"
                  />
                </Link>
              </li>
            </ul>
          </Sidebar.Items>
        </Sidebar>
      </Flowbite>
    </div>
  );
}

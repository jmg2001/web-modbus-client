"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGear, faChartArea } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/home", label: "Home", icon: faHome },
  { href: "/charts", label: "Charts", icon: faChartArea },
  { href: "/settings", label: "Settings", icon: faGear },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-fit">
      <nav className=" px-5 bg-[#121921] h-full flex flex-col gap-3 pt-4 text-lg w-[20vw] ">
        <div className="text-center">Logo</div>
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`
              flex gap-3 items-center hover:bg-[#243347] rounded-lg p-2 transition-colors ease-in cursor-pointer ${
                pathname === href ? "bg-[#243347]" : ""
              }  
            `}
          >
            <FontAwesomeIcon icon={icon} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

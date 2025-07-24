import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faGear,
  faChartArea,
  faTable,
} from "@fortawesome/free-solid-svg-icons";

const links = [
  { href: "/", label: "Home", icon: faHome },
  { href: "/charts", label: "Charts", icon: faChartArea },
  { href: "/table", label: "Table", icon: faTable },
  { href: "/settings", label: "Settings", icon: faGear },
];

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <aside className="w-fit">
      <nav className=" px-5 bg-[#121921] h-full flex flex-col gap-3 pt-4 text-lg w-[20vw] ">
        <div className="">Logo</div>
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            to={href}
            className={`
              flex gap-3 items-center hover:bg-[#243347] rounded-lg p-2 transition-colors ease-in cursor-pointer ${
                currentPath === href ? "bg-[#243347]" : ""
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

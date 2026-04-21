import { FaHome, FaChartBar, FaBullhorn, FaUsers } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

export const PRIVATE_MODULES = [
  {
    label: "Home",
    href: "/home",
    icon: FaHome,
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Minhas Campanhas",
    href: "/campanhas",
    icon: FaBullhorn,
    roles: ["ADMIN"],
  },
  {
    label: "Faturamento",
    href: "/faturamento",
    icon: FaChartBar,
    roles: ["ADMIN", "USER"],
  },
  {
    label: "Usuarios",
    href: "/usuarios",
    icon: FaUsers,
    roles: ["ADMIN"],
  },
  {
    label: "Logs do Cron",
    href: "/cron-logs",
    icon: FaClockRotateLeft,
    roles: ["ADMIN"],
  },
];

import { FaHome, FaChartBar, FaBullhorn, FaUsers } from "react-icons/fa";

export const PRIVATE_MODULES = [
  {
    label: "Home",
    href: "/home",
    icon: FaHome,
    roles: ["ADMIN", "USER"], // Todos veem
  },
  {
    label: "Minhas Campanhas",
    href: "/campanhas",
    icon: FaBullhorn,
    roles: ["ADMIN"], // Customer não vê
  },
  {
    label: "Faturamento",
    href: "/faturamento",
    icon: FaChartBar,
    roles: ["ADMIN", "USER"], // Apenas divulgadores e admin
  },
  {
    label: "Usuários",
    href: "/usuarios",
    icon: FaUsers,
    roles: ["ADMIN"], // Apenas o "god mode"
  },
];
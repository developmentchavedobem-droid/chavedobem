import { FaHome, FaBullhorn, FaGift, FaUsers, FaUserShield, FaChartBar } from "react-icons/fa";

export type UserRole = "ADMIN" | "USER" | "CUSTOMER";

export type PrivateModuleItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
};

export const PRIVATE_MODULES: PrivateModuleItem[] = [
  {
    label: "Home",
    href: "/home",
    icon: FaHome,
    roles: ["ADMIN", "USER", "CUSTOMER"]
  },
  {
    label: "Campanhas",
    href: "/campanhas",
    icon: FaGift,
    roles: ["ADMIN", "USER", "CUSTOMER"]
  },
  {
    label: "Meus Links",
    href: "/divulgador",
    icon: FaBullhorn,
    roles: ["USER"]
  },
  {
    label: "Usuários",
    href: "/usuarios",
    icon: FaUsers,
    roles: ["ADMIN"]
  },
  {
    label: "Administração",
    href: "/admin",
    icon: FaUserShield,
    roles: ["ADMIN"]
  },
  {
    label: "Relatórios",
    href: "/relatorios",
    icon: FaChartBar,
    roles: ["ADMIN", "USER"]
  }
];
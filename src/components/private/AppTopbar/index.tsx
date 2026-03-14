"use client";

import { FaBars  } from "react-icons/fa";
import { FaArrowRotateRight  } from "react-icons/fa6";

type Props = {
  userName?: string;
  userEmail?: string;
  onToggleSidebar: () => void;
  onToggleCollapse: () => void;
};

export default function AppTopbar({
  userName,
  userEmail,
  onToggleSidebar,
  onToggleCollapse
}: Props) {
  return (
    <header className="h-15 sm:h-25 bg-white flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-[#053B80]"
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
        >
          <FaBars />
        </button>

        <button
          className="hidden lg:inline-flex btn btn-sm"
          onClick={onToggleCollapse}
        >
          Menu
        </button>
      </div>

      <div className="hidden lg:flex text-sm text-zinc-700 w-[80%] h-[80%] items-center gap-2">
        <div className="w-[70%] h-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between text-[#026D9B] font-semibold">
          <span className="text-lg">
            {userName ? `Olá, ${userName}` : ""}
          </span>
          <span>
            {userName ? `${userEmail}` : ""}
          </span>
        </div>
        <div className="w-[30%] h-full bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
          <span className="font-semibold text-gray-400">Última atualização:<br/> 12:02</span>
          <button className="btn btn-circle btn-theme">
            <FaArrowRotateRight />
          </button>
        </div>
      </div>
    </header>
  );
}
"use client";

import { FaBars } from "react-icons/fa";

type Props = {
  userName?: string;
  onToggleSidebar: () => void;
  onToggleCollapse: () => void;
};

export default function AppTopbar({
  userName,
  onToggleSidebar,
  onToggleCollapse
}: Props) {
  return (
    <header className="h-20 border-b bg-white flex items-center justify-between px-4">
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

      <div className="text-sm text-zinc-700">
        {userName ? `Olá, ${userName}` : ""}
      </div>
    </header>
  );
}
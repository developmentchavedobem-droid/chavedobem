'use client'

import { useEffect, useRef, useState, useMemo } from "react";
import { useAuthStore } from "@/src/stores/auth.store";
import { FaArrowRotateRight } from "react-icons/fa6";
import { datePipe, monthPipe } from "@/src/utils/datepipe";
import "cally";

export default function PrivateHome() {
  const user = useAuthStore((state) => state.user);

  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLElement | null>(null);
  const monthSelected = useMemo(() => {
    return dateSelected.getMonth() + 1
  }, [dateSelected])

  useEffect(() => {
    const calendar = calendarRef.current;
    if (!calendar) return;

    const handleChange = (event: Event) => {
      const target = event.currentTarget as HTMLElement & { value?: string };
      const value = target.value;

      if (!value) return;

      // evita problema de fuso ao criar a data manualmente
      const [year, month, day] = value.split("-").map(Number);
      setDateSelected(new Date(year, month - 1, day));
    };

    calendar.addEventListener("change", handleChange);

    return () => {
      calendar.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex text-sm text-zinc-700 w-[80%] h-[80%] items-center gap-2">
        <div className="w-[70%] h-20 bg-gray-100 rounded-2xl p-4 flex items-center justify-between text-[#026D9B] font-semibold">
          <span className="text-lg">
            {user ? `Olá, ${user.profile?.name}` : ""}
          </span>
          <span>
            {user ? user.email : ""}
          </span>
        </div>

        <div className="w-[30%] h-20 bg-gray-100 rounded-2xl p-4 flex items-center justify-between">
          <span className="font-semibold text-gray-400">
            Última atualização:
            <br />
            12:02
          </span>

          <button className="btn btn-circle btn-theme">
            <FaArrowRotateRight />
          </button>
        </div>
      </div>

      <div className="bg-gray-100 w-[80%] h-[75vh] p-4 rounded-2xl">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex gap-2 items-baseline">
            <span className="text-2xl font-bold text-[#026D9B]">Dashboard</span>
            <span className="text-sm font-bold text-black">
              Cotação do dólar: R$ 5,17
            </span>
          </div>

          <div>
            <button
              popoverTarget="cally-popover1"
              className="input input-border rounded-2xl bg-white text-[#026D9B] font-bold border-2 border-[#026D9B] h-8"
              id="cally1"
              style={{ anchorName: "--cally1" } as React.CSSProperties}
            >
              {datePipe(dateSelected)}
            </button>

            <div
              popover="auto"
              id="cally-popover1"
              className="dropdown bg-base-100 rounded-box shadow-lg"
              style={{ positionAnchor: "--cally1" } as React.CSSProperties}
            >
              <calendar-date
                ref={calendarRef}
                class="cally bg-base-100 border border-base-300 shadow-lg rounded-box"
                value={dateSelected.toISOString().slice(0, 10)}
              >
                <svg
                  aria-label="Previous"
                  className="fill-current size-4"
                  slot="previous"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>

                <svg
                  aria-label="Next"
                  className="fill-current size-4"
                  slot="next"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>

                <calendar-month />
              </calendar-date>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col w-full h-full gap-4 pb-4">
            <div className="flex gap-4">
                <div className="w-[30%] h-35 bg-linear-to-b from-[#026D9B] to-[#237C7B] rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-white font-bold text-lg">Receita por data</span>
                <span className="text-white font-bold text-4xl">R$ 8,24</span>
                </div>
                <div className="w-[70%] h-35 bg-white rounded-2xl p-4 flex flex-col justify-between">
                <span className="text-gray-600 font-bold text-lg">Receita por data</span>
                <div className="flex gap-14">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm  text-gray-600">Total receita de {monthPipe(monthSelected)}</span>
                        <span className="text-[#026D9B] font-bold text-4xl">R$ 400,58</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-sm  text-gray-600">Receita líquida {monthPipe(monthSelected)}</span>
                        <span className="text-[#026D9B] font-bold text-4xl">R$ 400,58</span>
                    </div>
                </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 w-full h-[60%] bg-white rounded-2xl p-4">
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-600">Receita por link</span>
                    {user?.type === 'ADMIN' && (
                        <button className="btn btn-theme-primary">
                            Meus links
                        </button>
                    )} 
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
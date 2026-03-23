'use client'

import { useRef, useState } from "react";
import { useAuthStore } from "@/src/stores/auth.store";
import { FaArrowRotateRight } from "react-icons/fa6";
import { datePipe, monthPipe } from "@/src/utils/datepipe";
import AppDatePicker from "@/src/components/AppDatePicker";

export default function PrivateHome() {
  const user = useAuthStore((state) => state.user);

  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [monthSelected, setMonthSelected] = useState<Date>(new Date());
  const [periodSelected, setPeriodSelected] = useState({
    start: null as Date | null,
    end: null as Date | null,
  });

  const calendarRef = useRef<HTMLElement | null>(null);

  return (
    <div className="flex lg:w-full flex-col items-end gap-2 overflow-x-hidden px-3 pb-4 sm:px-4">
      <div className="flex w-full max-w-full flex-col items-stretch gap-2 text-sm text-zinc-700 lg:h-[80%] lg:w-[80%] lg:flex-row lg:items-center">
        <div className="flex w-full min-w-0 flex-col gap-1 rounded-2xl bg-gray-100 p-4 text-[#026D9B] font-semibold sm:h-20 sm:flex-row sm:items-center sm:justify-between lg:w-[70%]">
          <span className="text-lg">{user ? `Olá, ${user.profile?.name}` : ""}</span>
          <span className="min-w-0 break-all text-xs sm:text-sm">
            {user ? user.email : ""}
          </span>
        </div>

        <div className="flex w-full items-center justify-between rounded-2xl bg-gray-100 p-4 sm:h-20 lg:w-[30%]">
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

      <div className="w-full max-w-full overflow-hidden rounded-2xl bg-gray-100 p-4 lg:h-[75vh] lg:w-[80%]">
        <div className="mb-4 flex w-full max-w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-2">
            <span className="text-2xl font-bold text-[#026D9B]">Dashboard</span>
            <span className="wrap-break-word text-sm font-bold text-black">
              Cotação do dólar: R$ 5,17
            </span>
          </div>
        </div>

        <div className="flex h-full w-full max-w-full flex-col gap-4 pb-4">
          <div className="flex w-full max-w-full flex-col gap-4 lg:flex-row">
            <div className="flex h-35 w-full flex-col justify-between rounded-2xl bg-linear-to-b from-[#026D9B] to-[#237C7B] p-4 lg:w-[30%]">
              <div className="flex align-items-baseline justify-between">
                <span className="text-lg font-bold text-white">Receita diária</span>
                <AppDatePicker
                  id="dashboard-day"
                  mode="day"
                  value={dateSelected}
                  onChange={setDateSelected}
                />
              </div>
              <span className="text-3xl font-bold text-white sm:text-4xl">R$ 8,24</span>
            </div>

            <div className="flex h-auto w-full flex-col justify-between rounded-2xl bg-white p-4 lg:h-35 lg:w-[70%]">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-600">Receita mensal</span>
                <AppDatePicker
                  id="dashboard-month"
                  mode="month"
                  value={monthSelected}
                  onChange={setMonthSelected}
                />
              </div>
              <div className="flex flex-col gap-6 pt-3 sm:pt-0 lg:flex-row lg:gap-14">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-600">
                    Total receita de {monthPipe(monthSelected.getMonth())}
                  </span>
                  <span className="wrap-break-word text-3xl font-bold text-[#026D9B] sm:text-4xl">
                    R$ 400,58
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm text-gray-600">
                    Receita líquida de {monthPipe(monthSelected.getMonth())}
                  </span>
                  <span className="wrap-break-word text-3xl font-bold text-[#026D9B] sm:text-4xl">
                    R$ 400,58
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-full flex-col gap-6 rounded-2xl bg-white p-4 lg:h-[60%]">
            <div className="flex gap-3 items-end justify-between">
              <span className="text-lg font-bold text-gray-600">Receita por link</span>
              {user?.role === "ADMIN" && (
                <button className="btn btn-theme-primary">
                  Meus links
                </button>
              )}
            </div>

            <div className="mt-2 h-full w-full max-w-full overflow-x-auto overflow-y-auto">
              <table className="table table-zebra min-w-160 lg:min-w-0">
                <thead>
                  <tr className="text-gray-600">
                    <th></th>
                    <th>Link</th>
                    <th>Impressões</th>
                    <th>Receita</th>
                    <th>RPM</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                    <tr key={index} className="rounded-2xl font-semibold text-gray-600">
                      <th>{item}</th>
                      <td>lkaas_ads</td>
                      <td>514</td>
                      <td>R$ 254,00</td>
                      <td>R$ 2,50</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

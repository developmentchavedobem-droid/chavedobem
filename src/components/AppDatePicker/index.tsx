"use client";

import { useEffect, useMemo, useRef } from "react";
import "cally";

type PickerMode = "day" | "month" | "range";

type RangeValue = {
  start: Date | null;
  end: Date | null;
};

type AppDatePickerProps =
  | {
      id: string;
      mode: "day";
      value: Date;
      onChange: (value: Date) => void;
      className?: string;
      buttonClassName?: string;
      popoverClassName?: string;
      placeholder?: string;
    }
  | {
      id: string;
      mode: "month";
      value: Date;
      onChange: (value: Date) => void;
      className?: string;
      buttonClassName?: string;
      popoverClassName?: string;
      placeholder?: string;
    }
  | {
      id: string;
      mode: "range";
      value: RangeValue;
      onChange: (value: RangeValue) => void;
      className?: string;
      buttonClassName?: string;
      popoverClassName?: string;
      placeholder?: string;
    };

function formatDateToInput(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMonthToInput(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function parseDateString(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function parseMonthString(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1);
}

function formatLabelDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatLabelMonth(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatLabelRange(value: RangeValue) {
  if (!value.start && !value.end) return "Selecione o período";
  if (value.start && !value.end) return `${formatLabelDate(value.start)} - ...`;
  if (!value.start && value.end) return `... - ${formatLabelDate(value.end)}`;
  return `${formatLabelDate(value.start!)} - ${formatLabelDate(value.end!)}`;
}

export default function AppDatePicker(props: AppDatePickerProps) {
  const pickerRef = useRef<HTMLElement | null>(null);
  const anchorName = `--${props.id}`;

  const buttonLabel = useMemo(() => {
    if (props.mode === "day") {
      return props.value ? formatLabelDate(props.value) : props.placeholder || "Selecione a data";
    }

    if (props.mode === "month") {
      return props.value ? formatLabelMonth(props.value) : props.placeholder || "Selecione o mês";
    }

    return formatLabelRange(props.value);
  }, [props]);

  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker) return;

    const handleChange = (event: Event) => {
      const target = event.currentTarget as HTMLElement & {
        value?: string;
        valueStart?: string;
        valueEnd?: string;
      };

      if (props.mode === "day") {
        if (!target.value) return;
        props.onChange(parseDateString(target.value));
        return;
      }

      if (props.mode === "month") {
        if (!target.value) return;
        props.onChange(parseMonthString(target.value));
        return;
      }

      const start = target.getAttribute("value-start");
      const end = target.getAttribute("value-end");

      props.onChange({
        start: start ? parseDateString(start) : null,
        end: end ? parseDateString(end) : null,
      });
    };

    picker.addEventListener("change", handleChange);

    return () => {
      picker.removeEventListener("change", handleChange);
    };
  }, [props]);

  const pickerValue =
    props.mode === "day"
      ? formatDateToInput(props.value)
      : props.mode === "month"
      ? formatMonthToInput(props.value)
      : undefined;

  const rangeStart =
    props.mode === "range" && props.value.start
      ? formatDateToInput(props.value.start)
      : undefined;

  const rangeEnd =
    props.mode === "range" && props.value.end
      ? formatDateToInput(props.value.end)
      : undefined;

  return (
    <div className={props.className}>
      <button
        popoverTarget={`${props.id}-popover`}
        className={
          props.buttonClassName ||
          "input input-border h-8 w-full max-w-full rounded-2xl border-2 border-[#026D9B] bg-white text-[#026D9B] font-bold lg:w-auto"
        }
        id={props.id}
        style={{ anchorName } as React.CSSProperties}
        type="button"
      >
        {buttonLabel}
      </button>

      <div
        popover="auto"
        id={`${props.id}-popover`}
        className={
          props.popoverClassName ||
          "dropdown max-w-[calc(100vw-2rem)] rounded-box bg-base-100 shadow-lg"
        }
        style={{ positionAnchor: anchorName } as React.CSSProperties}
      >
        {props.mode === "day" && (
          <calendar-date
            ref={pickerRef}
            className="cally max-w-full rounded-box border border-base-300 bg-base-100 shadow-lg"
            value={pickerValue}
          >
            <svg
              aria-label="Previous"
              className="fill-current size-4"
              slot="previous"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>

            <svg
              aria-label="Next"
              className="fill-current size-4"
              slot="next"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>

            <calendar-month />
          </calendar-date>
        )}

        {props.mode === "month" && (
          <calendar-date
            ref={pickerRef}
            className="cally max-w-full rounded-box border border-base-300 bg-base-100 shadow-lg"
            value={pickerValue}
          >
            <svg
              aria-label="Previous"
              className="fill-current size-4"
              slot="previous"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>

            <svg
              aria-label="Next"
              className="fill-current size-4"
              slot="next"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>

            <calendar-month />
          </calendar-date>
        )}

        {props.mode === "range" && (
          <calendar-range
            ref={pickerRef}
            className="cally max-w-full rounded-box border border-base-300 bg-base-100 shadow-lg"
            value-start={rangeStart}
            value-end={rangeEnd}
          >
            <svg
              aria-label="Previous"
              className="fill-current size-4"
              slot="previous"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>

            <svg
              aria-label="Next"
              className="fill-current size-4"
              slot="next"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>

            <calendar-month />
          </calendar-range>
        )}
      </div>
    </div>
  );
}
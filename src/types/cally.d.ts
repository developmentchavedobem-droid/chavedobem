import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "calendar-date": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        class?: string;
      };
      "calendar-month": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
import type { ComponentProps } from "react";
import type { NavCard } from "@akinon/ui-react"; // <-- type-only
type NavCardIcon = ComponentProps<typeof NavCard>["icon"];

export type PageKey =
  | "home"
  | "dashboard"
  | "log"
  | "report"
  | "alarm"
  | "trigger"
  | "list_products_not_reflected_in_sales";

export type PageMeta = {
  key: PageKey;
  path: string;
  icon?: NavCardIcon;
  labelKey: string;
  titleKey?: string;
  descriptionKey?: string;
  showInMenu?: boolean;
  showOnHome?: boolean;
};

export const PAGES: PageMeta[] = [
  {
    key: "home",
    path: "/",
    labelKey: "page.home.box_title",
    titleKey: "page.home.title",
    descriptionKey: "page.home.description",
    showInMenu: true,
    showOnHome: false,
  },
  {
    key: "dashboard",
    path: "/dashboard",
    icon: "dashboard1",
    labelKey: "page.dashboard.box_title",
    descriptionKey: "page.dashboard.description",
    showInMenu: true,
    showOnHome: true,
  },
  {
    key: "log",
    path: "/log",
    icon: "log",
    labelKey: "page.log.box_title",
    descriptionKey: "page.log.description",
    showInMenu: true,
    showOnHome: true,
  },
  {
    key: "report",
    path: "/report",
    icon: "report",
    labelKey: "page.report.box_title",
    descriptionKey: "page.report.description",
    showInMenu: true,
    showOnHome: true,
  },
  {
    key: "alarm",
    path: "/alarm",
    icon: "warning_tri",
    labelKey: "page.alarm.box_title",
    descriptionKey: "page.alarm.description",
    showInMenu: true,
    showOnHome: true,
  },
  {
    key: "trigger",
    path: "/trigger",
    icon: "alarm-trigger",
    labelKey: "page.trigger.box_title",
    descriptionKey: "page.trigger.description",
    showInMenu: true,
    showOnHome: true,
  },
  {
    key: "list_products_not_reflected_in_sales",
    path: "/list-products-not-reflected-in-sales",
    icon: "report",
    labelKey: "page.list_products_not_reflected_in_sales.box_title",
    descriptionKey: "page.list_products_not_reflected_in_sales.description",
    showInMenu: false,
    showOnHome: false,
  },
] satisfies PageMeta[];

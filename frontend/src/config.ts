import type { FullpageApplicationConfig } from "@akinon/app-client";
import { i18n } from "@akinon/akilocale/react";
import { PAGES } from "@/pageMeta";

const { t } = i18n;

export const config: FullpageApplicationConfig = {
  isDev: true,
  forceRedirect: true,
  menu: PAGES.filter((p) => p.showInMenu).map((p) => ({
    label: t(p.labelKey),
    path: p.path,
  })),
};

export default config;

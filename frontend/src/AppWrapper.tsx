import { useEffect } from "react";
import { useAppClient } from "@akinon/app-client";
import { useTranslation } from "@akinon/akilocale/react";
import { akidate } from "@akinon/akidate";

export const AppWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { i18n } = useTranslation();
  const { locale, onLocaleChange } = useAppClient();

  useEffect(() => {
    i18n.changeLanguage(locale);
    akidate.setLocale(locale);

    const unsubscribe = onLocaleChange((newLocale) => {
      i18n.changeLanguage(newLocale);
      akidate.setLocale(newLocale);
    });

    return unsubscribe;
  }, [locale, onLocaleChange, i18n]);

  return children;
};

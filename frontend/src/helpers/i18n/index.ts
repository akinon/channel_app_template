import { Akilocale } from '@akinon/akilocale';

import en from '@/helpers/i18n/translations/en.ts';
import tr from '@/helpers/i18n/translations/tr.ts';

const i18n = Akilocale.createInstance({
  debug: false,
  fallbackLng: 'en',
  translations: {
    en,
    tr
  }
});

export const {
  t
}: {
  t: (key: string, val?: Record<string, string | number | undefined>) => string;
} = i18n;

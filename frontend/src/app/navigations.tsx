import { useLocation } from 'react-router-dom';

import { PageDashboard } from '@/pages/Dashboard';
import type { Navigation } from '@/types/navigations';
import { t } from '@/helpers/i18n';

export const navigations: Navigation[] = [
  {
    path: 'dashboard',
    label: t('dashboard'),
    element: <PageDashboard />,
    isSideMenu: true,
    breadcrumbItems: [{ title: t('dashboard'), href: '' }],
  }
].filter((nav) => {
  if (!('showOnlyIn' in nav)) return true;

  return (nav.showOnlyIn as string[]).includes(import.meta.env.VITE_MARKETPLACE_SLUG);
});

export const usePagePath = () => {
  const { pathname } = useLocation();
  const pagePath = pathname.split('/').slice(1).join('/');

  const page = navigations.find((nav) => {
    return pagePath.includes(nav.path);
  });

  if (!page) {
    throw new Error(t('pageNotFound', { pagePath }));
  }

  return pagePath;
};

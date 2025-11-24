import { Route, Routes as RoutesDOM } from 'react-router-dom';

import { navigations } from '@/app/navigations';
import PageBreadcrumb from '@/components/page-breadcrumb';
import { NotFound } from '@/components/404';
import { AuthenticatedLayout } from '@/components/authenticated-layout';
import type { Navigation } from '@/types/navigations';

export function Routes() {
  return (
    <RoutesDOM>
      <Route path='/'>
        {navigations.map((navigation: Navigation) => (
          <Route
            key={navigation.path}
            path={navigation.path}
            element={
              <AuthenticatedLayout>
                {navigation.breadcrumbItems && <PageBreadcrumb />}
                {navigation.element}
              </AuthenticatedLayout>
            }
          />
        ))}
    </Route>

    <Route path='*' element={<NotFound />} />
  </RoutesDOM>
  );
}

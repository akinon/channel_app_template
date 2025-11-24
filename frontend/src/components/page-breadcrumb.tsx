import { useAppClient } from '@akinon/app-client';
import { Breadcrumb } from '@akinon/ui-react';
import { generatePath } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { navigations, usePagePath } from '@/app/navigations';

export default function PageBreadcrumb() {
  const pagePath = usePagePath();
  const params = useParams();

  const { navigate } = useAppClient();

  return (
    <Breadcrumb
      items={
        navigations.find(nav => {
          let generatedPath = nav.path;

          try {
            generatedPath = generatePath(nav.path, params);
          } catch (e) {
            console.error(e);
          }

          return generatedPath === pagePath;
        })?.breadcrumbItems
      }
      onAnyItemClick={({ href }) => {
        navigate({ path: href });
      }}
    />
  );
}

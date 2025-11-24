import { Akilocale } from '@akinon/akilocale';
import { navigations } from "@/app/navigations";
import { Routes } from "@/app/routes";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import { AppClientProvider, useAppClient } from "@akinon/app-client";
import { AkinonUiProvider, Spin } from "@akinon/ui-react";
import { Suspense } from "react";
import { generatePath, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { locale } = useAppClient();

  Akilocale.setLanguage(locale || "en");

  return (
    <Suspense fallback={<Spin fullscreen />}>
      <AkinonUiProvider>
        <AppClientProvider
          config={{
            menu: navigations
              .filter((page) => page.isSideMenu)
              .map((page) => ({
                path: generatePath(page.path, page.generator || {}),
                label: page.label,
              })),
            forceRedirect: true,
            navigation: {
              navigate: ({ path }) => navigate(path)
            },
            isDev: true,
          }}
        >
          <AuthenticatedLayout>
            <Routes />
          </AuthenticatedLayout>
        </AppClientProvider>
      </AkinonUiProvider>
    </Suspense>
  )
}

export default App;
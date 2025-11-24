import { AppClientProvider } from "@akinon/app-client";
import { AkinonUiProvider } from "@akinon/ui-system";

import { useConfig } from "@/hooks";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { config } = useConfig();

  return (
    <AkinonUiProvider>
      <AppClientProvider config={config}>{children}</AppClientProvider>
    </AkinonUiProvider>
  );
};

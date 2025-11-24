import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Providers } from "@/providers";
import { Loading } from "@/components/Loading";
import { AppWrapper } from "@/AppWrapper";

export const App: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <AppWrapper>
          <Outlet />
        </AppWrapper>
      </Providers>
    </Suspense>
  );
};

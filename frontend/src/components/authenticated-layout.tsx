import { useAppClient } from "@akinon/app-client";
import { NotAuthenticated } from "./not-authenticated";

export function AuthenticatedLayout({children}: { children: React.ReactNode }) {
  const { data, isLoading } = useAppClient();

  return isLoading == false && data?.omnitronToken ? children : <NotAuthenticated />;
}
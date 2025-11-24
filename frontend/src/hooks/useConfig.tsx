import type {
  FullpageApplicationConfig,
  ApplicationNavigation,
  ApplicationNavigationPayload,
} from "@akinon/app-client";
import { useNavigate } from "react-router-dom";
import { config as rootConfig } from "../config";

export const useConfig = () => {
  const navigate = useNavigate();

  const navigation: ApplicationNavigation = {
    navigate: ({ path }: ApplicationNavigationPayload) => {
      navigate(path);
    },
  };

  const config: FullpageApplicationConfig = {
    ...rootConfig,
    navigation,
  };

  return { config, rootConfig };
};

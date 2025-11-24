import axios from "axios";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_MAIN_APP_URL}/api`,
});

// Tüm isteklerde token ekle
const attachToken = (config: any) => {
  config.headers = config.headers ?? {};
  config.headers["Authorization"] = `Token ${import.meta.env.VITE_OMNI_TOKEN}`;
  config.headers["token"] = import.meta.env.VITE_OMNI_TOKEN;
  return config;
};

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 || err?.response?.status === 403) {
      localStorage.removeItem("token");
    }
    return Promise.reject(err);
  },
);

apiClient.interceptors.request.use(attachToken);

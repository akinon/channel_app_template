import { Spin } from "@akinon/ui-spin";

export const Loading = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="flex flex-col items-center">
      <Spin size="large" />
    </div>
  </div>
);

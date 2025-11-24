export type Navigation = {
  path: string;
  label: string;
  element: React.ReactNode;
  isSideMenu: boolean;
  breadcrumbItems: { title: string; href: string }[];
  showOnlyIn?: string[];
  generator?: Record<string, string>;
};
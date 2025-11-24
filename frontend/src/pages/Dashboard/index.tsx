import "./index.css";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@akinon/akilocale/react";
import {
  Card,
  CardMeta,
  Col,
  Layout,
  PageContent,
  PageHeading,
  Result,
  Row,
  Spin,
  Text,
  Tooltip,
} from "@akinon/ui-react";
import { Icon } from "@akinon/icons";
import { DashboardSummary, getDashboardSummary } from "@/api/dashboard";

type StatItem = {
  label: string;
  value: number | string;
  footer?: string;
  tooltip: string;
};

const formatTime = (d: Date) =>
  d.toLocaleTimeString("tr-TR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const VIEW_TYPES = {
  loading: "loading",
  error: "error",
  content: "content",
  empty: "empty",
} as const;

type View = typeof VIEW_TYPES[keyof typeof VIEW_TYPES];

const getViewState = (
  loading: boolean,
  error: string | null,
  summary: DashboardSummary | null
): View => {
  if (loading) return VIEW_TYPES.loading;
  if (error) return VIEW_TYPES.error;
  if (summary) return VIEW_TYPES.content;
  return VIEW_TYPES.empty;
};

const buildStats = (
  summary: DashboardSummary,
  fetchedAt: Date | null,
  t: (k: string) => string
): StatItem[] => {
  const timeFooter = fetchedAt
    ? `${t("page.dashboard.request_time_prefix")}: ${formatTime(fetchedAt)}`
    : undefined;

  const items: StatItem[] = [
    {
      label: t("page.dashboard.stat.total_sku"),
      value: summary.total_sku,
      tooltip: t("page.dashboard.stat.total_sku_tooltip"),
    },
    {
      label: t("page.dashboard.stat.total_sku_on_sale"),
      value: summary.total_sku_on_sale,
      tooltip: t("page.dashboard.stat.total_sku_on_sale_tooltip"),
    },
    {
      label: t("page.dashboard.stat.total_product_stocks"),
      value: summary.total_product_stocks,
      tooltip: t("page.dashboard.stat.total_product_stocks_tooltip"),
    },
    {
      label: t("page.dashboard.stat.total_stocks"),
      value: summary.total_stocks,
      tooltip: t("page.dashboard.stat.total_stocks_tooltip"),
    },
  ];

  return timeFooter ? items.map(i => ({ ...i, footer: timeFooter })) : items;
};


const CartName = (label: string, tooltip: string) => (
  <div className="flex items-center gap-4">
    <span className="text-xs opacity-50 font-medium tracking-tight uppercase">
      {label}
    </span>
    <Tooltip placement="top" title={tooltip} trigger="hover" destroyTooltipOnHide>
      <Icon
        color="cyan"
        icon="info-outlined"
        size={14}
        className="cursor-pointer opacity-50 hover:opacity-100"
        aria-label={`${label} info`}
      />
    </Tooltip>
  </div>
);

export const PageDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const startedAt = new Date();
      const data = await getDashboardSummary();
      setSummary(data);
      setFetchedAt(startedAt);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          t("page.dashboard.error_fetch")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats: StatItem[] = summary ? buildStats(summary, fetchedAt, t) : [];
  const view: View = getViewState(loading, error, summary);

  const renderContent = () => {
    switch (view) {
      case VIEW_TYPES.loading:
        return (
          <div className="grid place-items-center py-16">
            <Spin size="large" />
          </div>
        );

      case VIEW_TYPES.error:
        return (
          <Result
            status="error"
            title={t("page.dashboard.error_title")}
            subTitle={error ?? ""}
          />
        );

      case VIEW_TYPES.content:
        return (
          <Row gutter={16}>
            {stats.map((s) => (
              <Col span={6} key={s.value}>
                <Card>
                  <CardMeta
                    title={s.value || "0"}
                    description={CartName(s.label, s.tooltip)}
                  />
                  {s.footer ? (
                    <div className="mt-7">
                      <Text className="opacity-60 mt-10">{s.footer}</Text>
                    </div>
                  ) : null}
                </Card>
              </Col>
            ))}
          </Row>
        );

      default:
        return (
          <Result
            status="404"
            title={t("page.dashboard.no_data_yet")}
            subTitle={t("page.dashboard.no_data_yet_description")}
          />
        );
    }
  };

  return (
    <Layout>
      <Layout.Content>
        <div className="page-heading-container">
          <PageHeading
            title={t("page.dashboard.title")}
            description={t("page.dashboard.description")}
          />
        </div>
        <div className="page-content-container">
          <PageContent>{renderContent()}</PageContent>
        </div>
      </Layout.Content>
    </Layout>
  );
};

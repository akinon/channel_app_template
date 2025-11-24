import "./index.css";

import React, { useEffect, useMemo, useState } from "react";
import { getFlows, type Flow, type FlowStatus } from "@/api/flows";
import { Akifilter } from "@akinon/akifilter";
import { Akitable, AkitablePageSizes } from "@akinon/akitable";
import { filterSchema } from "./Table/filter";
import { Layout, PageContent, PageHeading } from "@akinon/ui-layout";
import { useTranslation } from "@akinon/akilocale/react";
import { Modal } from "@akinon/ui-react";
import { makeLogColumns } from "./Table/columns";
import FlowDetailModal from "./components/FlowDetailModal";
import TransactionModal from "./components/TransactionModal";
import usePaginationFromQueryParams from "@/hooks/use-pagination-from-query-params";

type Filters = { [key: string]: string | number | boolean | undefined };
type FilterOption = { key: string; value: string; label: string };

export const PageLog: React.FC = () => {
  const { t } = useTranslation();
  const { page, limit, syncPaginationWithQueryParams } =
    usePaginationFromQueryParams();

  const [rows, setRows] = useState<Flow[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [runOpen, setRunOpen] = useState(false);
  const [payloadOpen, setPayloadOpen] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);
  const [pagination, setPagination] = useState({ page, limit });
  const [flowOptions, setFlowOptions] = useState<FilterOption[]>();

  const [filters, setFilters] = useState<Filters>({
    flow_name: "",
    flow_author: "",
    status: "",
    id: "",
    transaction_id: "",
    started_at: "",
    ended_at: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { items } = await getFlows({ limit: 100, offset: 0 });
        const uniq = Array.from(
          new Set(
            (Array.isArray(items) ? items : [])
              .map((x: any) => x?.flow_name)
              .filter((n: any) => typeof n === "string" && n.trim().length > 0)
          )
        ) as string[];

        if (mounted && uniq.length) {
          setFlowOptions(uniq.map((n) => ({ key: n, value: n, label: n })));
        }
      } catch (_) {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const dynamicFilterSchema = useMemo(() => {
    return filterSchema.map((f) => {
      if (f.key === "flow_name") {
        return {
          ...f,
          type: "select" as const,
          placeholder: t("page.log.flow_detail.flow_name"),
          options: flowOptions ?? [],
        };
      }
      return f;
    });
  }, [flowOptions, t]);

  useEffect(() => {
    if (!filters.flow_name && !filters.transaction_id) {
      setRows([]);
      setTotal(0);
      return;
    }

    setLoading(true);

    const offset = (page - 1) * pagination.limit;
    const lmt = offset + pagination.limit;

    getFlows({
      flow_name: filters.flow_name ? String(filters.flow_name) : undefined,
      flow_author: filters.flow_author ? String(filters.flow_author) : undefined,
      status: filters.status ? (String(filters.status) as FlowStatus) : undefined,
      id: filters.id ? String(filters.id) : undefined,
      transaction_id: filters.transaction_id ? String(filters.transaction_id) : undefined,
      limit: lmt,
      offset,
    })
      .then(({ items, total }) => {
        setRows(Array.isArray(items) ? items : []);
        setTotal(typeof total === "number" ? total : (items ? items.length : 0));
      })
      .catch((e) => {
        console.error(e);
        setRows([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [
    filters.flow_name,
    filters.flow_author,
    filters.status,
    filters.id,
    filters.transaction_id,
    filters.started_at,
    filters.ended_at,
    pagination.page,
    pagination.limit,
  ]);

  const handlePaginationChange = (page: number, size: number) => {
    const params = { page, limit: size };
    setPagination(params);
    syncPaginationWithQueryParams(params);
  };

  const handleOpenRun = (flow: Flow) => {
    setSelectedFlow(flow);
    setRunOpen(true);
  };

  const handleOpenPayload = (flow: Flow) => {
    setSelectedFlow(flow);
    setPayloadOpen(true);
  };

  console.log('total', total);

  const logData =  total > limit ? { results: rows, count: total } : rows;

  return (
    <Layout className="log-page-container">
      <Layout.Content>
        <div className="page-heading-container">
          <PageHeading title={t("page.log.title") || "Logs"} />
        </div>

        <PageContent>
          <Akifilter
            filterSchema={dynamicFilterSchema as typeof filterSchema}
            useAppliedFilters={[filters, setFilters]}
          />

          {total > 0 && (
            <Akitable
              rowKey="id"
              isLoading={loading}
              columns={makeLogColumns({ handleOpenRun, handleOpenPayload })}
              data={logData}
              header={{ title: "Channel App Logları" }}
              pagination={
                total > limit
                  ? {
                      page: pagination.page,
                      size: pagination.limit as AkitablePageSizes,
                    }
                  : undefined
              }
              onPaginationChanged={handlePaginationChange}
            />
          )}
        </PageContent>
      </Layout.Content>

      <Modal
        open={runOpen}
        onCancel={() => setRunOpen(false)}
        title={`${selectedFlow?.flow_name ?? ""} – ${selectedFlow?.id ?? ""} – Main flow`}
        className="log-detail-modal"
      >
        <FlowDetailModal
          flow={selectedFlow}
          onOpenPayload={(_, flw) => {
            setSelectedFlow(flw);
            setPayloadOpen(true);
          }}
        />
      </Modal>

      <Modal
        open={payloadOpen}
        onCancel={() => setPayloadOpen(false)}
        title={`${selectedFlow?.flow_name ?? ""} – ${selectedFlow?.id ?? ""} – Main flow`}
        className="transaction-log-modal"
      >
        <TransactionModal flow={selectedFlow} />
      </Modal>
    </Layout>
  );
};

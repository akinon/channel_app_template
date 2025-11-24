import { useEffect, useMemo, useState } from "react";
import { Row, Col } from "@akinon/ui-layout";
import { Card, Text, Select, Spin } from "@akinon/ui-react";
import { Akitable, AkitableColumn } from "@akinon/akitable";
import { getFlowSteps, type Flow, type FlowStep } from "@/api/flows";
import { Icon } from "@akinon/icons";
import { useTranslation } from "@akinon/akilocale/react";

type Props = {
  flow: Flow | null;
  onOpenPayload: (step: FlowStep, flow: Flow) => void;
};

type LocalFilters = { status: "" | "SUCCESS" | "FAILURE" | "IN_PROGRESS" };
const EMPTY: LocalFilters = { status: "" };

const toDateText = (v?: string | null) => (v ? new Date(v).toLocaleString() : "—");

function RowKV({ k, v }: { k: string; v: string }) {
  return (
    <Row gutter={8}>
      <Col span={8}>
        <Text style={{ opacity: 0.7 }}>{k}</Text>
      </Col>
      <Col span={14}>
        <Text style={{ fontSize: 12 }} strong>{v}</Text>
      </Col>
    </Row>
  );
}

export default function FlowDetailModal({ flow, onOpenPayload }: Props) {
  const { t } = useTranslation();
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState<LocalFilters>(EMPTY);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!flow?.id) return;
    setF(EMPTY);
    setErr(null);
    setLoading(true);
    (async () => {
      try {
        const st = await getFlowSteps(flow.id);
        setSteps(Array.isArray(st) ? st : []);
      } catch (e: any) {
        console.error(e);
        setSteps([]);
        setErr(e?.message ?? t("page.log.flow_detail.detail_not_loaded"));
      } finally {
        setLoading(false);
      }
    })();
  }, [flow?.id]);

  // Summary statistics (based on steps)
  const stats = useMemo(() => {
    const total = steps.length;
    const success = steps.filter((s) => s.status === "SUCCESS").length;
    const failure = steps.filter((s) => s.status === "FAILURE").length;
    const times = steps.flatMap((s) => [s.start_time, s.end_time].filter(Boolean) as string[]);
    const start = times.length ? new Date(Math.min(...times.map((t) => +new Date(t)))) : null;
    const end = times.length ? new Date(Math.max(...times.map((t) => +new Date(t)))) : null;
    return { total, success, failure, start, end };
  }, [steps]);

  const filtered = useMemo(
    () => (f.status ? steps.filter((s) => s.status === f.status) : steps),
    [steps, f.status]
  );

  const columns: AkitableColumn[] = [
    {
      title: t("page.log.flow_detail.log_id"),
      dataIndex: "id",
      key: "id"
    },
    {
      title: t("page.log.flow_detail.step"),
      dataIndex: "step_name",
      key: "name"
    },
    {
      title: t("page.log.flow_detail.status"),
      dataIndex: "status",
      key: "status",
      render: (s: FlowStep["status"]) => {
        const bg =
          s === "SUCCESS" ? "rgba(16,185,129,.20)" : s === "FAILURE" ? "rgba(239,68,68,.20)" : "rgba(245,158,11,.20)";
        const color =
          s === "SUCCESS" ? "#047857" : s === "FAILURE" ? "#b91c1c" : "#92400e";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: 6,
              background: bg,
              color,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {s}
          </span>
        );
      },
    },
    {
      title: t("page.log.flow_detail.request_time"),
      dataIndex: "start_time",
      key: "start_time",
      render: (v: string) => toDateText(v),
    },
    {
      title: t("page.log.flow_detail.response_time"),
      dataIndex: "end_time",
      key: "end_time",
      render: (v: string) => toDateText(v),
    },
    {
      title: t("page.log.flow_detail.payload_file"),
      key: "payload",
      render: (_: any, record: any) => {
        const s = record as FlowStep;
        return (
          <div style={{ textAlign: "center" }}>
            <Icon
              icon="log"
              onClick={() => flow && onOpenPayload(s, flow)}
              size={24}
              style={{ cursor: "pointer" }}
            />
          </div>
        );
      },
    },
  ];

  const logDetailData = [
    {
      label: t("page.log.flow_detail.flow_name"),
      value: flow?.flow_name ?? "—"
    },
    {
      label: t("page.log.flow_detail.flow_id"),
      value: flow?.id ?? "—"
    },
    {
      label: t("page.log.flow_detail.flow_start_time"),
      value: stats.start ? new Date(stats.start.toISOString()).toLocaleString() : "—"
    },
    {
      label: t("page.log.flow_detail.flow_end_time"),
      value: stats.end ? new Date(stats.end.toISOString()).toLocaleString() : "—"
    },
    {
      label: t("page.log.flow_detail.total_steps"),
      value: String(stats.total)
    },
    {
      label: t("page.log.flow_detail.total_success"),
      value: String(stats.success)
    },
    {
      label: t("page.log.flow_detail.total_failure"),
      value: String(stats.failure)
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Row gutter={16}>
        <Col span={16}>
          <Card title={t("page.log.flow_detail.detail_title")} size="small">
            <div style={{ display: "grid", gap: 8 }}>
              {logDetailData.map((item) => (
                <RowKV key={item.label} k={item.label} v={item.value} />
              ))}
            </div>

            {err && (
              <Text style={{ marginTop: 8, color: "#b91c1c", fontSize: 10 }}>{err}</Text>
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title={t("page.log.flow_detail.process_status")} size="small">
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Spin size="small" />
                <Text style={{ fontSize: 13, opacity: 0.7 }}>{t("page.log.flow_detail.loading")}</Text>
              </div>
            ) : steps.length === 0 ? (
                <Text style={{ fontSize: 13, opacity: 0.7 }}>{t("page.log.flow_detail.no_data")}</Text>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {steps.map((s) => (
                  <div
                    key={s.id}
                    title={`${s.step_name ?? s.id} – ${s.status}`}
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 4,
                      background:
                        s.status === "SUCCESS"
                          ? "#10b981"
                          : s.status === "FAILURE"
                          ? "#ef4444"
                          : "#f59e0b",
                    }}
                  />
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Filter */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title={t("page.log.flow_detail.filter_title")} size="small">
            <div style={{ display: "grid", gap: 8, gridTemplateColumns: "minmax(0,240px)" }}>
              <Select
                placeholder={t("page.log.flow_detail.status_all_placeholder")}
                value={f.status || undefined}
                size="middle"
                onChange={(value) => setF({ status: (value as LocalFilters["status"]) || "" })}
                options={[
                  {
                    label: t("page.log.flow_detail.filter_all"),
                    value: ""
                  },
                  {
                    label: t("page.log.flow_detail.filter_success"),
                    value: "SUCCESS"
                  },
                  {
                    label: t("page.log.flow_detail.filter_failure"),
                    value: "FAILURE"
                  },
                  {
                    label: t("page.log.flow_detail.filter_in_progress"),
                    value: "IN_PROGRESS"
                  },
                ]}
                allowClear
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Row gutter={16}>
        <Col span={24}>
          <Akitable
            rowKey="id"
            isLoading={loading}
            columns={columns}
            data={filtered}
            header={{ title: t("page.log.flow_detail.step_list_title") }}
          />
        </Col>
      </Row>
    </div>
  );
}

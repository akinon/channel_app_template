import React, { useCallback, useEffect, useState } from "react";
import { Row, Col } from "@akinon/ui-layout";
import { Card, Button, Select, Text, Spin } from "@akinon/ui-react";
import { getFlowSteps, type Flow, type FlowStep } from "@/api/flows";
import { useTranslation } from "@akinon/akilocale/react";

type Props = {
  flow: Flow | null;
  initialStep?: FlowStep | null;
  copyIcon?: React.ReactNode;
  downloadIcon?: React.ReactNode;
  refreshIcon?: React.ReactNode;
};

type StepExtra = {
  id?: string | number;
  name?: string;
  step_name?: string;
  status?: string;
  start_time?: string | number | Date;
  end_time?: string | number | Date;
  duration_ms?: number;
  exceptions?: any[];
  error_message?: unknown;
  step_metadata?: Record<string, unknown>;
  // legacy
  metadata?: unknown;
  payload?: unknown;
  response?: unknown;
  request?: unknown;
  output?: unknown;
  input?: unknown;
  error?: unknown;
  exception_details?: unknown;
  [k: string]: unknown;
};
type Step = FlowStep & StepExtra;

const styles = {
  dimText: { opacity: 0.7 },
  dangerText: { color: "#b91c1c" },
  pre: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: 13,
    lineHeight: 1.6,
    margin: 0,
    maxHeight: 480,
    overflow: "auto",
  } as const,
};

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const nonEmpty = (v: unknown) =>
  v != null && (isObj(v) ? Object.keys(v).length > 0 : String(v).trim().length > 0);

const toText = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v ?? "");
  }
};

const fmtDt = (d?: string | number | Date) => (d ? new Date(d).toLocaleString() : "");

const saveAs = (filename: string, text: string) => {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
const exceptionsToText = (excs: any[]): string =>
  Array.isArray(excs) && excs.length
    ? excs
        .map((e) => {
          const type = e?.type ? `[${e.type}]` : "[Exception]";
          const time = e?.created_at ? ` ${new Date(e.created_at).toLocaleString()}` : "";
          const msg = e?.message ? `\nMessage: ${e.message}` : "";
          const tb = e?.traceback ? `\n${e.traceback}` : "";
          return `${type}${time}${msg}${tb}`.trim();
        })
        .filter(Boolean)
        .join("\n\n---\n\n")
    : "";

const pickBestPayload = (step?: Step | null): unknown | null => {
  if (!step) return null;
  const candidates: unknown[] = [
    exceptionsToText(step.exceptions ?? []),
    step.error_message,
    step.step_metadata,
    // legacy
    step.metadata,
    step.payload,
    step.response,
    step.request,
    step.output,
    step.input,
    step.error,
    step.exception_details,
  ];
  const found = candidates.find((c) => nonEmpty(c));
  return found ?? null;
};

const calcNextId = (items: Step[], preferId?: string | null, initialId?: string | number | null) => {
  const ids = new Set(items.map((s) => String(s.id)));
  const picks = [preferId, initialId, items[0]?.id].filter(Boolean).map(String);
  return (picks.find((p) => ids.has(p)) ?? null) as string | null;
};

const buildOptions = (steps: Step[]) =>
  steps.map((s, i) => ({
    label: `${s.step_name || s.name || `Step ${i + 1}`}${s.status ? ` — ${s.status}` : ""}`,
    value: String(s.id),
  }));

const ActionButton: React.FC<{
  title: string;
  onClick: () => void;
  disabled?: boolean;
  fallbackIcon?: any;
  customIcon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, onClick, disabled, fallbackIcon, customIcon, children }) => {
  if (customIcon) {
    return (
      <Button
        size="small"
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        {customIcon} {children}
      </Button>
    );
  }
  return (
    <Button
      size="small"
      onClick={onClick}
      disabled={disabled}
      icon={fallbackIcon}
      title={title}
    >
      {children}
    </Button>
  );
};

const MetaKV = ({ k, v }: { k: string; v?: React.ReactNode }) => (
  <Text style={{ fontSize: 12 }}>
    <b>{k}:</b> <span style={styles.dimText as React.CSSProperties}>{v ?? "—"}</span>
  </Text>
);

export default function TransactionModal({
  flow,
  initialStep,
  copyIcon,
  downloadIcon,
  refreshIcon,
}: Props) {
  const { t } = useTranslation();
  const flowId = flow?.id as string | undefined;

  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(
    async (preferId?: string | null) => {
      if (!flowId) return;
      setErr(null);
      setLoading(true);
      try {
        const st = await getFlowSteps(flowId);
        const items = (Array.isArray(st) ? st : []) as Step[];
        setSteps(items);
        setSelectedId(calcNextId(items, preferId ?? null, (initialStep?.id as any) ?? null));
      } catch (e: any) {
        console.error(e);
        setSteps([]);
        setSelectedId(null);
        setErr(e?.message || t("page.log.transaction_modal.data_load_error"));
      } finally {
        setLoading(false);
      }
    },
    [flowId, initialStep?.id, t]
  );

  useEffect(() => {
    if (flowId) load(null);
  }, [flowId, load]);

  const selected = steps.find((s) => String(s.id) === String(selectedId)) ?? null;
  const best = pickBestPayload(selected);
  const textToShow = toText(best ?? "");
  const stepTitle = selected?.step_name || selected?.name || "Step";
  const flowTitle = flow?.flow_name || (flow as any)?.name || "transaction";
  const selectOptions = buildOptions(steps);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(textToShow);
      alert(t("page.log.transaction_modal.copy_success"));
    } catch {
      alert(t("page.log.transaction_modal.copy_fail"));
    }
  }

  function onDownload() {
    saveAs(`${flowTitle}_${stepTitle}.json`, textToShow);
  }

  const actions = [
    {
      key: "refresh",
      title: t("page.log.transaction_modal.refresh"),
      onClick: () => load(selectedId),
      disabled: loading,
      fallbackIcon: "refresh" as const,
      customIcon: refreshIcon,
      label: t("page.log.transaction_modal.refresh"),
    },
    {
      key: "copy",
      title: t("page.log.transaction_modal.copy"),
      onClick: onCopy,
      disabled: !best,
      fallbackIcon: "copy" as const,
      customIcon: copyIcon,
      label: t("page.log.transaction_modal.copy"),
    },
    {
      key: "download",
      title: t("page.log.transaction_modal.download"),
      onClick: onDownload,
      disabled: !best,
      fallbackIcon: "download" as const,
      customIcon: downloadIcon,
      label: t("page.log.transaction_modal.download"),
    },
  ] as const;

  const renderBody = () => {
    if (loading)
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Spin size="small" /> <Text style={styles.dimText}>{t("page.log.flow_detail.loading")}</Text>
        </div>
      );
    if (err) return <Text style={styles.dangerText}>{err}</Text>;
    if (!selected) return <Text style={styles.dimText}>{t("page.log.transaction_modal.step_not_found")}</Text>;
    if (!best)
      return (
        <Text style={styles.dimText}>
          {t("page.log.transaction_modal.no_content")}
          <br />
          <small>
            {t("page.log.transaction_modal.no_content_note")}
          </small>
        </Text>
      );
    return <pre style={styles.pre}>{textToShow}</pre>;
  };

  const LogSteps = [
    {
      label: t("page.log.transaction_modal.step_label"),
      value: stepTitle
    },
    {
      label: t("page.log.transaction_modal.status_label"),
      value: selected?.status ?? "—"
    },
    {
      label: t("page.log.transaction_modal.start_label"),
      value: selected?.start_time && fmtDt(selected.start_time)
    },
    {
      label: t("page.log.transaction_modal.end_label"),
      value: selected?.end_time && fmtDt(selected.end_time)
    },
    {
      label: t("page.log.transaction_modal.duration_label"),
      value: selected?.duration_ms != null && `${selected.duration_ms} ms`
    },
  ];

  return (
    <div className="flex gap-4 flex-col">
      <Row gutter={8}>
        <Col span={12} md={10} lg={8}>
          <Select
            value={selectedId ?? undefined}
            onChange={(val: unknown) => setSelectedId((val as string) ?? null)}
            options={selectOptions}
            placeholder={t("page.log.transaction_modal.select_step_placeholder")}
            showArrow
            variant="outlined"
            size="middle"
          />
        </Col>
        <Col span={12} md={14} lg={16}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {actions.map((a) => (
              <ActionButton
                key={a.key}
                title={a.title}
                onClick={a.onClick}
                disabled={a.disabled}
                fallbackIcon={a.fallbackIcon}
                customIcon={a.customIcon}
              >
                {a.label}
              </ActionButton>
            ))}
          </div>
        </Col>
      </Row>

      {selected && (
        <Row gutter={12} wrap>
          {LogSteps.map((step) => (
            <Col key={step.label}>
              {step.value && <MetaKV k={step.label} v={step.value} />}
            </Col>
          ))}
        </Row>
      )}

      <Card>{renderBody()}</Card>
    </div>
  );
}

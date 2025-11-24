import { FlowStatus, type Flow } from "@/api/flows";
import type { AkitableColumn } from "@akinon/akitable";
import { Icon } from "@akinon/icons";

export type MakeLogColumnsArgs = {
  handleOpenRun: (record: Flow) => void;
  handleOpenPayload: (record: Flow) => void;
};

export const makeLogColumns = ({
  handleOpenRun,
  handleOpenPayload,
}: MakeLogColumnsArgs): AkitableColumn[] => [
  {
    title: 'ID',
    dataIndex: "id",
    key: "id",
    render: (value, record) => {
      return (
        <div
          className="cursor-pointer underline"
          onClick={() => handleOpenRun(record as Flow)}
          style={{ color: "royalblue" }}
        >
          {value}
        </div>
      );
    },
  },
  {
    title: 'Flow Name',
    dataIndex: 'flow_name',
    key: 'flow_name'
  },
  {
    title: "LOG TİPİ",
    key: "log_type",
    render: () => "Main Log",
  },
  {
    title: 'Flow Author',
    dataIndex: 'flow_author',
    key: 'flow_author'
  },
  {
    title: 'Started At',
    dataIndex: 'started_at',
    key: 'started_at',
    render: (text: string) => new Date(text).toLocaleString()
  },
  {
    title: 'Ended At',
    dataIndex: 'ended_at',
    key: 'ended_at',
    render: (text: string) => new Date(text).toLocaleString()
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (s: FlowStatus) => {
      const color =
        s === "SUCCESS"
          ? "bg-emerald-500/20 text-emerald-300"
          : s === "FAILURE"
          ? "bg-red-500/20 text-red-300"
          : "bg-yellow-500/20 text-yellow-200";
      return <span className={`rounded px-2 py-0.5 ${color}`}>{s}</span>;
    },
  },
  {
    title: "KAYIT DOSYASI",
    key: "payload",
    render: (_: unknown, record: unknown) => (
      <div className="text-center">
        <Icon
          icon="log"
          onClick={() => handleOpenPayload(record as Flow)}
          size={24}
          className=""
        />
      </div>
    ),
  },
  {
    title: 'Transaction ID',
    dataIndex: 'transaction_id',
    key: 'transaction_id'
  },
];

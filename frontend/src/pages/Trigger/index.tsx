import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "@akinon/akilocale/react";
import usePaginationFromQueryParams from "@/hooks/use-pagination-from-query-params";
import { Layout, PageHeading, PageContent } from "@akinon/ui-layout";
import { TriggerModal } from "./trigger-modal";
import {
  Akitable,
  type AkitableData,
  type AkitablePageSizes,
} from "@akinon/akitable";
import { fetchTasks, type TaskResponse } from "@/api/trigger";
import { RootState, useAppDispatch } from "@/store";

export const PageTrigger: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: taskList, loading: isTasksLoading } = useSelector(
    (state: RootState) => state.trigger,
  );

  const { t } = useTranslation();
  const { page, limit, syncPaginationWithQueryParams } =
    usePaginationFromQueryParams();

  const [pagination, setPagination] = useState({ page, limit });

  const handlePaginationChange = (page: number, size: number) => {
    const params = { page, limit: size };
    setPagination(params);
    syncPaginationWithQueryParams(params);
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const columns = [
    {
      title: t("page.common.name"),
      dataIndex: "name",
    },
    {
      title: t("page.trigger.box_title"),
      dataIndex: "name",
      render: (name: string, row: AkitableData) => (
        <TriggerModal name={name} args={row.args as TaskResponse["args"]} />
      ),
    },
  ];

  return (
    <Layout>
      <Layout.Content>
        <div className="page-heading-container">
          <PageHeading
            title={t("page.trigger.title")}
            description={t("page.trigger.description")}
          />
        </div>
        <div className="page-content-container">
          <PageContent>
            <Akitable
              pagination={
                taskList.results.length
                  ? {
                      page: pagination.page,
                      size: pagination.limit as AkitablePageSizes,
                    }
                  : undefined
              }
              onPaginationChanged={handlePaginationChange}
              data={taskList.results.length ? taskList : []}
              isLoading={isTasksLoading}
              header={{ title: t("page.trigger.box_title") }}
              rowKey="id"
              columns={columns}
            />
          </PageContent>
        </div>
      </Layout.Content>
    </Layout>
  );
};

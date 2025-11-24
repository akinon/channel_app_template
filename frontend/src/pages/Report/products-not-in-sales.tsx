import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "@akinon/akilocale/react";
import usePaginationFromQueryParams from "@/hooks/use-pagination-from-query-params";
import { Layout, PageHeading, PageContent } from "@akinon/ui-layout";
import { Akitable, type AkitablePageSizes } from "@akinon/akitable";
import { akidate } from "@akinon/akidate";
import { fetchProducts } from "@/api/report";
import { defaultDateTimeValueFormat } from "@/constants/common";
import { type RootState, useAppDispatch } from "@/store";

const renderDateColumn = (date: string) =>
  akidate.formatIsoDate(date, defaultDateTimeValueFormat);

const columns = [
  {
    title: "page.common.pk",
    dataIndex: "pk",
  },
  {
    title: "page.common.name",
    dataIndex: "name",
  },
  {
    title: "page.common.sku",
    dataIndex: "sku",
  },
  {
    title: "page.common.created_date",
    dataIndex: "created_date",
    render: (date: string) => renderDateColumn(date),
  },
  {
    title: "page.common.modified_date",
    dataIndex: "modified_date",
    render: (date: string) => renderDateColumn(date),
  },
];

export const PageProductsNotInSale = () => {
  const dispatch = useAppDispatch();
  const { data: products, loading: isProductsLoading } = useSelector(
    (state: RootState) => state.report,
  );

  const { t } = useTranslation();

  const { page, limit, syncPaginationWithQueryParams } =
    usePaginationFromQueryParams();

  const [pagination, setPagination] = useState({ page, limit });

  useEffect(() => {
    dispatch(fetchProducts({ page, limit }));
  }, [page, limit]);

  const handlePaginationChange = (page: number, size: number) => {
    const params = { page, limit: size };
    setPagination(params);
    syncPaginationWithQueryParams(params);
  };

  return (
    <Layout>
      <Layout.Content>
        <div className="page-heading-container">
          <PageHeading
            title={t("page.report.title")}
            description={t("page.report.description")}
          />
        </div>
        <div className="page-content-container">
          <PageContent>
            <Akitable
              pagination={
                products && products.results.length
                  ? {
                      page: pagination.page,
                      size: pagination.limit as AkitablePageSizes,
                    }
                  : undefined
              }
              onPaginationChanged={handlePaginationChange}
              data={products && products.results.length ? products : []}
              isLoading={isProductsLoading}
              header={{
                title: t("page.report.list_products_not_reflected_in_sales"),
              }}
              rowKey="id"
              columns={columns.map((col) => ({
                ...col,
                title: t(col.title),
              }))}
            />
          </PageContent>
        </div>
      </Layout.Content>
    </Layout>
  );
};

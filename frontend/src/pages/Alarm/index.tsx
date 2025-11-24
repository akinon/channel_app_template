import { Layout, PageHeading, PageContent } from "@akinon/ui-layout";
import { useTranslation } from "@akinon/akilocale/react";

export const PageAlarm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Layout.Content>
        <div className="page-heading-container">
          <PageHeading
            title={t("page.alarm.title")}
            description={t("page.alarm.description")}
          />
        </div>
        <div className="page-content-container">
          <PageContent>Alarm page content.</PageContent>
        </div>
      </Layout.Content>
    </Layout>
  );
};

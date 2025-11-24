import { Layout, PageHeading, PageContent } from "@akinon/ui-layout";
import { useTranslation } from "@akinon/akilocale/react";
import { Link, NavCard, Text, Col, Row } from "@akinon/ui-react";
import { PAGES } from "@/pageMeta";

export const PageHome: React.FC = () => {
  const { t } = useTranslation();

  const cards = PAGES.filter(
    (p): p is typeof p & { icon: NonNullable<typeof p.icon> } =>
      Boolean(p.showOnHome && p.icon),
  );

  return (
    <Layout>
      <Layout.Content>
        <div className="page-heading-container">
          <PageHeading
            title={t("page.home.title")}
            description={t("page.home.description")}
          />
        </div>

        <div className="page-content-container">
          <PageContent>
            <div className="storybook-grid">
              <Row gutter={[24, 24]} wrap>
                {cards.map((p) => (
                  <Col span={8} key={p.key}>
                    <Link href={p.path}>
                      <NavCard
                        icon={p.icon}
                        title={t(p.labelKey)}
                        variant="default"
                        description={
                          <Text style={{ color: "var(--color-blue-955)" }}>
                            {p.descriptionKey ? t(p.descriptionKey) : ""}
                          </Text>
                        }
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          </PageContent>
        </div>
      </Layout.Content>
    </Layout>
  );
};

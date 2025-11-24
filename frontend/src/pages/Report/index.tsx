import { useState, type ComponentProps } from "react";
import { useTranslation } from "@akinon/akilocale/react";
import { ExportModals } from "./export-modals";
import { Layout, PageHeading, PageContent, Row, Col } from "@akinon/ui-layout";
import {
  Link,
  Text,
  NavCard,
  type NavCard as NavCardType,
} from "@akinon/ui-react";

export const CARD_KEYS = {
  product: "product",
  price: "price",
  stock: "stock",
} as const;

export type Card = {
  key: keyof typeof CARD_KEYS;
  path?: string;
  icon: ComponentProps<typeof NavCardType>["icon"];
  labelKey: string;
  descriptionKey: string;
  triggerModal: boolean;
};

const CARDS: Card[] = [
  {
    key: CARD_KEYS.product,
    icon: "urunlistesi",
    path: "/list-products-not-reflected-in-sales",
    labelKey: "page.report.list_products_not_reflected_in_sales",
    descriptionKey: "",
    triggerModal: false,
  },
  {
    key: CARD_KEYS.price,
    icon: "fiyat_listeleri",
    labelKey: "page.report.list_products_with_price_difference",
    descriptionKey: "",
    triggerModal: true,
  },
  {
    key: CARD_KEYS.stock,
    icon: "stok_listeleri",
    labelKey: "page.report.list_stock_difference",
    descriptionKey: "",
    triggerModal: true,
  },
];

export const PageReport = () => {
  const { t } = useTranslation();

  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

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
            <Row gutter={[24, 24]} wrap>
              {CARDS.map((card) => (
                <Col span={8} key={card.key}>
                  <Link
                    href={card?.path}
                    onClick={
                      card.triggerModal
                        ? (e) => {
                            e.preventDefault();
                            setSelectedCard(card);
                          }
                        : undefined
                    }
                  >
                    <NavCard
                      icon={card.icon}
                      title={t(card.labelKey)}
                      variant="default"
                      description={
                        <Text style={{ color: "var(--color-blue-955)" }}>
                          {card.descriptionKey ? t(card.descriptionKey) : ""}
                        </Text>
                      }
                    />
                  </Link>
                </Col>
              ))}
            </Row>
          </PageContent>
        </div>
      </Layout.Content>

      <ExportModals
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
      />
    </Layout>
  );
};

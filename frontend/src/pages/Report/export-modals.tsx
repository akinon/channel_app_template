import { type Dispatch, type SetStateAction, useState } from "react";
import { useTranslation } from "@akinon/akilocale/react";
import { Flex } from "@akinon/ui-layout";
import {
  Modal,
  Select,
  Input,
  Button,
  Space,
  InputNumber,
} from "@akinon/ui-react";
import {
  Akiform,
  akivalResolver,
  FormItem,
  useFieldArray,
  useForm,
} from "@akinon/akiform";
import { akival } from "@akinon/akival";
import { Icon } from "@akinon/icons";
import type { Card } from "./index";
import { Akitable, AkitablePageSizes } from "@akinon/akitable";
import { akidate } from "@akinon/akidate";
import { defaultDateTimeValueFormat } from "@/constants/common";
import usePaginationFromQueryParams from "@/hooks/use-pagination-from-query-params";
import {
  type AsyncExportResponse,
  DifferencesTypes,
  type ExportResponse,
  type ExportNotSelectedResponse,
  getDifferences,
  downloadCSV,
} from "@/api/report";
import { getTaskStatus } from "@/api/trigger";
import { showNotification, sleep } from "@/helpers";

type ExportNotSelectedState = {
  results: ExportNotSelectedResponse[];
  count: number;
};

type ExportModalProps = {
  selectedCard: Card | null;
  setSelectedCard: Dispatch<SetStateAction<Card | null>>;
};

const objectKeys = <Obj extends object>(obj: Obj): (keyof Obj)[] => {
  return Object.keys(obj) as (keyof Obj)[];
};

export const EXPORT_TYPES = {
  export: {
    label: "Export",
    value: "export",
  },
  async_export: {
    label: "Async Export",
    value: "async_export",
  },
} as const;

const EXPORT_TYPE_OPTIONS = objectKeys(EXPORT_TYPES).map((key) => ({
  label: EXPORT_TYPES[key].label,
  value: key,
}));

const FORM_ITEM_LABEL_COL = { span: 24 };

const INITIAL_FIELD_VALUES = {
  pk: undefined as unknown as number,
  price: undefined as unknown as number,
  stock: undefined as unknown as number,
  sku: "",
};

type FormDataFields = {
  pk: number;
  price?: number;
  stock?: number;
  sku: string;
}[];

export const ExportModals = ({
  selectedCard,
  setSelectedCard,
}: ExportModalProps) => {
  const { t } = useTranslation();

  const { page, limit, syncPaginationWithQueryParams } =
    usePaginationFromQueryParams();

  const [pagination, setPagination] = useState({ page, limit });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exportNotSelectedResult, setExportNotSelectedResult] =
    useState<ExportNotSelectedState | null>(null);

  const schema = akival.object().shape({
    export_type: akival
      .mixed<keyof typeof EXPORT_TYPES>()
      .oneOf(objectKeys(EXPORT_TYPES)),
    fields: akival
      .array()
      .of(
        akival.object({
          pk: akival
            .number()
            .required(
              t("page.common.is_required", {
                field: t("page.common.pk"),
              }),
            )
            .min(0, t("page.common.enter_positive_number")),
          price:
            selectedCard?.key === DifferencesTypes.Price
              ? akival
                  .number()
                  .required(
                    t("page.common.is_required", {
                      field: t("page.common.price"),
                    }),
                  )
                  .min(0, t("page.common.enter_positive_number"))
                  .typeError(t("page.common.enter_positive_number"))
              : akival.number().notRequired(),
          stock:
            selectedCard?.key === DifferencesTypes.Stock
              ? akival
                  .number()
                  .required(
                    t("page.common.is_required", {
                      field: t("page.common.stock"),
                    }),
                  )
                  .min(0, t("page.common.enter_positive_number"))
                  .typeError(t("page.common.enter_positive_number"))
              : akival.number().notRequired(),
          sku: akival.string().required(
            t("page.common.is_required", {
              field: t("page.common.sku"),
            }),
          ),
        }),
      )
      .required(),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    resolver: akivalResolver(schema),
    mode: "onChange",
    defaultValues: {
      export_type: undefined,
      fields: [INITIAL_FIELD_VALUES],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "fields",
  });

  const addField = () => append(INITIAL_FIELD_VALUES);

  const removeField = (index: number) => () => remove(index);

  const handleClose = () => {
    setSelectedCard(null);
    setIsSubmitting(false);
    setExportNotSelectedResult(null);
    reset({
      export_type: undefined,
      fields: [INITIAL_FIELD_VALUES],
    });
  };

  const handlePaginationChange = (page: number, size: number) => {
    const params = { page, limit: size };
    setPagination(params);
    syncPaginationWithQueryParams(params);
  };

  const pollTaskStatus = async (taskId: string, interval = 2000) => {
    while (true) {
      const response = await getTaskStatus(taskId);

      if (response && response.ready) {
        return response.status === "SUCCESS" ? response : Promise.reject();
      }

      await sleep(interval);
    }
  };

  const handleDownloadCSV = async (filePath: string) => {
    const response = await downloadCSV(filePath);

    const blobUrl = URL.createObjectURL(response);

    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = filePath.split("/").pop() as string;
    downloadLink.click();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  };

  const handleExportNotSelectedSubmission = (
    response: ExportNotSelectedResponse[],
  ) => {
    setExportNotSelectedResult({
      count: response.length,
      results: response,
    });

    reset({
      export_type: undefined,
      fields: [INITIAL_FIELD_VALUES],
    });
    setIsSubmitting(false);
  };

  const handleAsyncExportSubmission = async (response: AsyncExportResponse) => {
    const { result } = await pollTaskStatus(response.task_id);

    if (result && result.file_path) {
      handleDownloadCSV(result.file_path);
    }
  };

  const onSubmit = async (data: akival.InferType<typeof schema>) => {
    if (!selectedCard) return;

    try {
      setIsSubmitting(true);

      const isExport = data.export_type === EXPORT_TYPES.export.value;
      const isAsyncExport =
        data.export_type === EXPORT_TYPES.async_export.value;
      const isExportNotSelected = !isExport && !isAsyncExport;
      const differenceType = selectedCard.key as DifferencesTypes;

      const body = {
        items: data.fields as FormDataFields,
      };

      const queries = {
        params: {
          ...(isExport ? { export: true } : {}),
          ...(isAsyncExport ? { export: true, async_export: true } : {}),
        },
      };

      const response = await getDifferences(differenceType, body, queries);

      if (isExportNotSelected) {
        handleExportNotSelectedSubmission(
          response as ExportNotSelectedResponse[],
        );
        return;
      }

      if (isExport) {
        const exportResponse = response as ExportResponse;
        await handleDownloadCSV(exportResponse.file_path);
      }

      if (isAsyncExport) {
        await handleAsyncExportSubmission(response as AsyncExportResponse);
      }

      setIsSubmitting(false);
      handleClose();
    } catch (error) {
      showNotification("error", error || t("page.report.export_fail"));
    }
  };

  return (
    <Modal
      open={!!selectedCard}
      title={!!selectedCard ? t(selectedCard?.labelKey) : ""}
      closable
      maskClosable
      destroyOnClose
      centered
      footer={null}
      onCancel={handleClose}
      width={exportNotSelectedResult ? 750 : 550}
    >
      <Flex vertical gap={18} className="py-5">
        {exportNotSelectedResult ? (
          <Akitable
            pagination={
              exportNotSelectedResult && exportNotSelectedResult.results.length
                ? {
                    page: pagination.page,
                    size: pagination.limit as AkitablePageSizes,
                  }
                : undefined
            }
            onPaginationChanged={handlePaginationChange}
            data={
              exportNotSelectedResult && exportNotSelectedResult.results.length
                ? exportNotSelectedResult
                : []
            }
            header={{
              title: selectedCard ? t(selectedCard?.labelKey) : "",
            }}
            rowKey="id"
            columns={[
              {
                title: t("page.common.pk"),
                dataIndex: "product_pk",
              },
              {
                title: t("page.common.sku"),
                dataIndex: "product_sku",
              },
              {
                title: t(`page.report.${selectedCard?.key}_difference`),
                dataIndex: `${selectedCard?.key}_difference`,
              },
              {
                title: t("page.common.updated_at"),
                dataIndex: "updated_at",
                render: (date) =>
                  akidate.formatIsoDate(date, defaultDateTimeValueFormat),
              },
            ]}
          />
        ) : (
          <Akiform
            layout="horizontal"
            onFinish={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <FormItem
              name="export_type"
              control={control as any}
              rootClassName="w-full"
            >
              <Select
                rootClassName="w-full"
                placeholder={t("page.common.export_type")}
                options={EXPORT_TYPE_OPTIONS}
              />
            </FormItem>

            {fields.map((field, index: number) => (
              <Space size="small" direction="horizontal" key={field.id}>
                <FormItem
                  name={`fields.${index}.pk`}
                  label={t("page.common.pk")}
                  control={control as any}
                  required
                  labelCol={FORM_ITEM_LABEL_COL}
                >
                  <InputNumber
                    placeholder={t("page.common.pk")}
                    size="large"
                    className="w-full"
                  />
                </FormItem>
                {selectedCard?.key === DifferencesTypes.Price && (
                  <FormItem
                    name={`fields.${index}.price`}
                    label={t("page.common.price")}
                    control={control as any}
                    required
                    labelCol={FORM_ITEM_LABEL_COL}
                  >
                    <Input
                      placeholder={t("page.common.price")}
                      size="large"
                      className="w-full"
                    />
                  </FormItem>
                )}
                {selectedCard?.key === DifferencesTypes.Stock && (
                  <FormItem
                    name={`fields.${index}.stock`}
                    label={t("page.common.stock")}
                    control={control as any}
                    required
                    labelCol={FORM_ITEM_LABEL_COL}
                  >
                    <InputNumber
                      placeholder={t("page.common.stock")}
                      size="large"
                      className="w-full"
                    />
                  </FormItem>
                )}
                <FormItem
                  name={`fields.${index}.sku`}
                  label={t("page.common.sku")}
                  control={control as any}
                  required
                  labelCol={FORM_ITEM_LABEL_COL}
                >
                  <Input
                    placeholder={t("page.common.sku")}
                    size="large"
                    className="w-full"
                  />
                </FormItem>

                <Icon
                  icon="plus"
                  onClick={addField}
                  color="var(--color-green-500)"
                  className="cursor-pointer mt-8"
                />
                {fields.length > 1 && (
                  <Icon
                    icon="minus"
                    onClick={removeField(index)}
                    color="var(--color-red-500)"
                    className="cursor-pointer mt-8"
                  />
                )}
              </Space>
            ))}

            <Button
              type="primary"
              htmlType="submit"
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
              className="w-72 mt-5"
            >
              {t("page.common.export")}
            </Button>
          </Akiform>
        )}
      </Flex>
    </Modal>
  );
};

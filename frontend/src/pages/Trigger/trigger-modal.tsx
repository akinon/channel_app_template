import { useState } from "react";
import { useTranslation } from "@akinon/akilocale/react";
import {
  Akiform,
  akivalResolver,
  FormItem,
  useFieldArray,
  useForm,
} from "@akinon/akiform";
import { akival } from "@akinon/akival";
import { Icon } from "@akinon/icons";
import {
  Button,
  Flex,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Text,
} from "@akinon/ui-react";
import {
  type PriceTriggerFields,
  type StockTriggerFields,
  ExportType,
  type TaskResponse,
  triggerTask,
} from "@/api/trigger";
import { showNotification } from "@/helpers";

type FormData =
  | { export_type: ExportType.EXPORT; fields: StockTriggerFields[] }
  | { export_type: ExportType.ASYNC_EXPORT; fields: PriceTriggerFields[] };

type TriggerModalProps = {
  name: string;
  args: TaskResponse["args"];
};

const FORM_ITEM_LABEL_COL = { span: 24 };
const EXPORT_TYPE_CONFIG = {
  [ExportType.EXPORT]: {
    key: "stock",
    label: "Stock",
    value: ExportType.EXPORT as const,
    initialFields: {
      pk: undefined as unknown as number,
      stock: undefined as unknown as number,
      sku: "",
    },
  },
  [ExportType.ASYNC_EXPORT]: {
    key: "price",
    label: "Price",
    value: ExportType.ASYNC_EXPORT as const,
    initialFields: {
      pk: undefined as unknown as number,
      price: undefined as unknown as number,
      sku: "",
    },
  },
};

const getExportTypeOptions = () => {
  return Object.values(EXPORT_TYPE_CONFIG).map((type) => ({
    label: type.label,
    value: type.value,
  }));
};

export const TriggerModal: React.FC<TriggerModalProps> = ({ name, args }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = akival.lazy((values: FormData) => {
    if (
      values.export_type === EXPORT_TYPE_CONFIG[ExportType.ASYNC_EXPORT].value
    ) {
      return akival.object({
        export_type: akival
          .mixed<ExportType.ASYNC_EXPORT>()
          .oneOf([ExportType.ASYNC_EXPORT])
          .required(t("page.common.export_type")),
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
              price: akival
                .number()
                .required(
                  t("page.common.is_required", {
                    field: t(`page.common.price`),
                  }),
                )
                .min(0, t("page.common.enter_positive_number")),
              sku: akival.string().required(
                t("page.common.is_required", {
                  field: t("page.common.sku"),
                }),
              ),
            }),
          )
          .required(),
      });
    }

    return akival.object({
      export_type: akival
        .mixed<ExportType.EXPORT>()
        .oneOf([ExportType.EXPORT])
        .required(t("page.common.export_type")),
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
            stock: akival
              .number()
              .required(
                t("page.common.is_required", {
                  field: t(`page.common.stock`),
                }),
              )
              .min(0, t("page.common.enter_positive_number")),
            sku: akival.string().required(
              t("page.common.is_required", {
                field: t("page.common.sku"),
              }),
            ),
          }),
        )
        .required(),
    });
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
    watch,
  } = useForm<FormData>({
    resolver: akivalResolver(schema),
    mode: "onChange",
  });

  const exportType: ExportType = watch("export_type");

  const { fields, remove, append } = useFieldArray({
    control,
    name: "fields",
  });

  const addField = () => append(EXPORT_TYPE_CONFIG[exportType].initialFields);

  const removeField = (index: number) => () => remove(index);

  const handleExportTypeChange = (value: string | boolean | number) => {
    if (value === EXPORT_TYPE_CONFIG[ExportType.ASYNC_EXPORT].value) {
      reset({
        export_type: EXPORT_TYPE_CONFIG[ExportType.ASYNC_EXPORT].value,
        fields: [EXPORT_TYPE_CONFIG[ExportType.ASYNC_EXPORT].initialFields],
      });
      return;
    }

    reset({
      export_type: EXPORT_TYPE_CONFIG[ExportType.ASYNC_EXPORT].value,
      fields: [EXPORT_TYPE_CONFIG[ExportType.ASYNC_EXPORT].initialFields],
    });
  };

  const onCancel = () => {
    reset({
      export_type: undefined,
      fields: [],
    });
    setIsOpen(false);
  };

  const onSubmit = async (data?: FormData) => {
    try {
      setIsSubmitting(true);

      const params = {
        task_name: name,
        params:
          !args.length || !data
            ? {}
            : {
                export_type: data.export_type,
                products: data.fields,
              },
      };

      await triggerTask(params);

      setIsSubmitting(false);
      setIsOpen(false);
      showNotification("success", t("page.trigger.trigger_success"));
    } catch (error) {
      setIsSubmitting(false);
      showNotification("error", t("page.trigger.trigger_fail"));
    }
  };

  const handleRunButtonClick = () => {
    if (args.length) {
      setIsOpen(true);
      return;
    }

    onSubmit();
  };

  return (
    <>
      <Button type="primary" block onClick={handleRunButtonClick}>
        {t("page.trigger.run")}
      </Button>

      <Modal
        open={isOpen}
        title={t("page.trigger.box_title") + ` - ${name}`}
        closable
        maskClosable
        destroyOnClose
        centered
        footer={null}
        onCancel={onCancel}
        className="trigger-modal"
      >
        <Text>{t("page.trigger.trigger_modal_desc")}</Text>
        <Flex vertical gap={18} className="py-5">
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
                options={getExportTypeOptions()}
                onChange={handleExportTypeChange}
              />
            </FormItem>

            {!!exportType &&
              fields.map((field, index: number) => (
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
                  <FormItem
                    name={`fields.${index}.${EXPORT_TYPE_CONFIG[exportType].key}`}
                    label={t(
                      `page.common.${EXPORT_TYPE_CONFIG[exportType].key}`,
                    )}
                    control={control as any}
                    required
                    labelCol={FORM_ITEM_LABEL_COL}
                  >
                    <InputNumber
                      placeholder={t(
                        `page.common.${EXPORT_TYPE_CONFIG[exportType].key}`,
                      )}
                      size="large"
                      className="w-full"
                    />
                  </FormItem>
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
              {t("page.trigger.run")}
            </Button>
          </Akiform>
        </Flex>
      </Modal>
    </>
  );
};

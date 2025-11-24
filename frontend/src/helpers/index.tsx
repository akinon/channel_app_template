import { notification, type notificationBoxType } from "@akinon/ui-react";

export const formatString = (
  str: string,
  ...args: (string | number)[]
): string => {
  let formatted = str;

  args.forEach((arg, index) => {
    formatted = formatted.replace(`{${index}}`, String(arg));
  });

  return formatted;
};

// TODO-en: After the notification types are exported correctly, remove this type and use the exported one
type NotificationTypes = notificationBoxType | "warning";

export const showNotification = (type: NotificationTypes, message: string) => {
  notification[type]({
    message,
    placement: "top",
    duration: 5,
  });
};

export const sleep = async (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

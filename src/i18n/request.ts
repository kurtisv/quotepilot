import { getRequestConfig } from "next-intl/server";

import { defaultLocale, getLocaleOrDefault } from "./config";
import { getMessages } from "./messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = getLocaleOrDefault((await requestLocale) ?? defaultLocale);

  return {
    locale,
    messages: getMessages(locale),
  };
});

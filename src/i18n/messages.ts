import en from "./messages/en";
import fr from "./messages/fr";
import { defaultLocale, type Locale } from "./config";

export const messages = {
  en,
  fr,
} as const;

export function getMessages(locale: Locale = defaultLocale) {
  return messages[locale];
}

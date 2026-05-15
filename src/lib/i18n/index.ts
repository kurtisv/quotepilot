import { cookies } from "next/headers";
import { translations, type Lang, type T } from "./translations";

export type { Lang, T };

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const val = store.get("lang")?.value;
  return val === "en" ? "en" : "fr";
}

export async function getT(): Promise<T> {
  const lang = await getLang();
  return translations[lang];
}

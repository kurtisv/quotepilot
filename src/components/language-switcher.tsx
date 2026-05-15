"use client";

export function LanguageSwitcher({ current }: { current: string }) {
  function switchLang(lang: string) {
    document.cookie = `lang=${lang};path=/;max-age=31536000`;
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      <button
        onClick={() => switchLang("fr")}
        className={current === "fr" ? "font-semibold text-foreground" : "hover:text-foreground"}
      >
        FR
      </button>
      <span>/</span>
      <button
        onClick={() => switchLang("en")}
        className={current === "en" ? "font-semibold text-foreground" : "hover:text-foreground"}
      >
        EN
      </button>
    </div>
  );
}

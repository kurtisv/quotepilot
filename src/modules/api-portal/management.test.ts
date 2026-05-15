import { describe, expect, it } from "vitest";

import { parseApiKeyFormData } from "./management";

describe("api key management forms", () => {
  it("parses API key name and comma-separated scopes", () => {
    const formData = new FormData();
    formData.set("name", "Production");
    formData.set("scopes", "demo:read, usage:read");

    expect(parseApiKeyFormData(formData)).toEqual({
      name: "Production",
      scopes: ["demo:read", "usage:read"],
    });
  });
});

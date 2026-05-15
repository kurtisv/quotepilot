import { describe, expect, it } from "vitest";

import { getSanitySchemaNames, sanitySchemas } from "./sanity-schemas";

describe("sanity schemas", () => {
  it("includes required marketing and blog document schemas", () => {
    expect(getSanitySchemaNames()).toEqual(
      expect.arrayContaining([
        "siteSettings",
        "page",
        "article",
        "author",
        "category",
        "serviceContent",
        "faq",
        "testimonial",
        "pricingPlan",
        "navigation",
      ]),
    );
  });

  it("defines fields for every schema", () => {
    expect(sanitySchemas.every((schema) => schema.fields.length > 0)).toBe(true);
  });
});

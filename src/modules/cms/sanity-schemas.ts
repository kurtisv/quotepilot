export type SanityField = {
  name: string;
  title: string;
  type: string;
  of?: SanityField[];
  fields?: SanityField[];
  options?: Record<string, unknown>;
  validation?: string;
};

export type SanitySchema = {
  name: string;
  title: string;
  type: "document" | "object";
  fields: SanityField[];
};

export const sanitySchemas: SanitySchema[] = [
  {
    name: "siteSettings",
    title: "Site Settings",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "description", title: "Description", type: "text" },
      { name: "primaryCtaLabel", title: "Primary CTA Label", type: "string" },
      { name: "primaryCtaHref", title: "Primary CTA Link", type: "string" },
    ],
  },
  {
    name: "page",
    title: "Page",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
      { name: "seoTitle", title: "SEO Title", type: "string" },
      { name: "seoDescription", title: "SEO Description", type: "text" },
      { name: "sections", title: "Sections", type: "array", of: [{ name: "section", title: "Section", type: "object" }] },
    ],
  },
  {
    name: "article",
    title: "Article",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
      { name: "excerpt", title: "Excerpt", type: "text" },
      { name: "body", title: "Body", type: "array", of: [{ name: "block", title: "Block", type: "block" }] },
      { name: "author", title: "Author", type: "reference", options: { to: [{ type: "author" }] } },
      { name: "category", title: "Category", type: "reference", options: { to: [{ type: "category" }] } },
      { name: "publishedAt", title: "Published At", type: "datetime" },
    ],
  },
  {
    name: "author",
    title: "Author",
    type: "document",
    fields: [
      { name: "name", title: "Name", type: "string" },
      { name: "bio", title: "Bio", type: "text" },
      { name: "image", title: "Image", type: "image" },
    ],
  },
  {
    name: "category",
    title: "Category",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    ],
  },
  {
    name: "serviceContent",
    title: "Service",
    type: "document",
    fields: [
      { name: "title", title: "Title", type: "string" },
      { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
      { name: "summary", title: "Summary", type: "text" },
      { name: "features", title: "Features", type: "array", of: [{ name: "feature", title: "Feature", type: "string" }] },
    ],
  },
  {
    name: "faq",
    title: "FAQ",
    type: "document",
    fields: [
      { name: "question", title: "Question", type: "string" },
      { name: "answer", title: "Answer", type: "text" },
      { name: "category", title: "Category", type: "string" },
    ],
  },
  {
    name: "testimonial",
    title: "Testimonial",
    type: "document",
    fields: [
      { name: "quote", title: "Quote", type: "text" },
      { name: "name", title: "Name", type: "string" },
      { name: "role", title: "Role", type: "string" },
      { name: "company", title: "Company", type: "string" },
    ],
  },
  {
    name: "pricingPlan",
    title: "Pricing Plan",
    type: "document",
    fields: [
      { name: "name", title: "Name", type: "string" },
      { name: "price", title: "Price", type: "string" },
      { name: "description", title: "Description", type: "text" },
      { name: "features", title: "Features", type: "array", of: [{ name: "feature", title: "Feature", type: "string" }] },
      { name: "stripePriceId", title: "Stripe Price ID", type: "string" },
    ],
  },
  {
    name: "navigation",
    title: "Navigation",
    type: "document",
    fields: [
      { name: "label", title: "Label", type: "string" },
      { name: "items", title: "Items", type: "array", of: [{ name: "navItem", title: "Navigation Item", type: "object" }] },
    ],
  },
];

export function getSanitySchemaNames() {
  return sanitySchemas.map((schema) => schema.name);
}

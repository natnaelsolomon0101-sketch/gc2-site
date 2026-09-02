import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { notes } from "@/content/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/firm", "/strategies", "/insights", "/partnership", "/diligence", "/governance", "/letters", "/tearsheet", "/questions", "/access", "/contact", "/disclosures"];
  const now = new Date();
  return [
    ...routes.map((r) => ({
      url: `${siteUrl}${r}`, lastModified: now,
      changeFrequency: "monthly" as const, priority: r === "" ? 1 : 0.7,
    })),
    ...notes.map((n) => ({
      url: `${siteUrl}/insights/${n.slug}`, lastModified: new Date(n.date),
      changeFrequency: "yearly" as const, priority: 0.5,
    })),
  ];
}

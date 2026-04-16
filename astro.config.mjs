// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import analytics from "@vercel/analytics/astro";

// https://astro.build/config
export default defineConfig({
  prefetch: false,
  integrations: [
    starlight({
      title: "Svelte5 Hook Form",
      favicon: "/icon.png",
      customCss: ["./src/styles/starlight-theme.css"],
      components: {
        SocialIcons: "./src/components/starlight/SocialIcons.astro",
        SiteTitle: "./src/components/starlight/SiteTitle.astro",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/ElijahJKim/svelte5-hook-form",
        },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Introduction", slug: "guides/introduction" },
            { label: "Quick Start", slug: "guides/quick-start" },
            { label: "Core Concepts", slug: "guides/core-concept" },
          ],
        },
        {
          label: "API Reference",
          items: [
            { label: "Form Status", slug: "api/form-status" },
            { label: "Methods", slug: "api/methods" },
          ],
        },
      ],
    }),
    svelte(),
    analytics(),
  ],
});

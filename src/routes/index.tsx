import { createFileRoute, redirect } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/dashboard" }); },
  head: () => ({ meta: [
    { title: "SRIVAARI AUTOMOBILES — Showroom Management" },
    { name: "description", content: "Premium bike showroom and finance operations management." },
    { property: "og:title", content: "SRIVAARI AUTOMOBILES — Showroom Management" },
    { property: "og:description", content: "Premium bike showroom and finance operations management." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => null,
});

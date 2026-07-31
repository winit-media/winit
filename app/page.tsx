import { getSiteContent } from "@/lib/serverContent";
import HomeClient from "./home-client";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.pageTitle || "WinIt - Shaping Success Stories",
    description:
      content.pageDescription ||
      "We transform brand stories into powerful narratives that drive success.",
    alternates: { canonical: "/" },
    openGraph: {
      title: content.pageTitle || "WinIt - Shaping Success Stories",
      description:
        content.pageDescription ||
        "We transform brand stories into powerful narratives that drive success.",
      url: "https://winitmedia.com",
    },
  };
}

export default async function Home() {
  const initialContent = await getSiteContent();
  return <HomeClient initialContent={initialContent} />;
}

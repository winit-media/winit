import { getSiteContent } from "@/lib/serverContent";
import HomeClient from "./home-client";

export const revalidate = 60;

export default async function Home() {
  const initialContent = await getSiteContent();
  return <HomeClient initialContent={initialContent} />;
}

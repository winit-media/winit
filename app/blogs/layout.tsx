import dynamic from "next/dynamic";
import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import FloatingCTA from "@/components/FloatingCTA";
import { getSiteContent } from "@/lib/serverContent";

const Footer = dynamic(() => import("@/components/Footer"));

export default async function BlogsLayout({ children }: { children: React.ReactNode }) {
  const initialContent = await getSiteContent();
  return (
    <AdminProvider initialContent={initialContent}>
      <Navbar />
      {children}
      <Footer />
      <FloatingCTA />
    </AdminProvider>
  );
}

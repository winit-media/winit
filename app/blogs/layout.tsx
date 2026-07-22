import dynamic from "next/dynamic";
import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import FloatingCTA from "@/components/FloatingCTA";

const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <Navbar />
      {children}
      <Footer />
      <FloatingCTA />
    </AdminProvider>
  );
}

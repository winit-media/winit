import { AdminProvider } from "@/components/AdminProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

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

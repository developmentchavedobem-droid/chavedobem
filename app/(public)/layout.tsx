import PublicHeader from "@/src/components/PublicHeader";
import Footer from "@/src/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />

      <main className="pt-10">
        {children}
      </main>

      <Footer />
    </>
  );
}
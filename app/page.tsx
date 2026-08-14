import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900">
      <Navbar />
      <div className="pt-14">
        <HeroSection />
      </div>
    </main>
  );
}

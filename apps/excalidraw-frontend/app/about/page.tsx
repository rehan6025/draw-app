import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/NavBar";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      <section className="pt-32 pb-20 font-base  bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50"></section>
      <div className="max-w-6xl text-center mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-bold"></h1>
      </div>
      <Footer />
    </div>
  );
}

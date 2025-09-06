import Navbar from "@/components/ui/Nav";
import Hero from "@/components/new-landing/Hero1";
import Problems from "@/components/new-landing/Problems";
import Vision from "@/components/new-landing/Vision";
import Features from "@/components/new-landing/Features";
import Workflow from "@/components/new-landing/Workflow";
import Architecture from "@/components/new-landing/Architecture";
import Validation from "@/components/new-landing/Validation";
import CTA from "@/components/new-landing/CTA";
export default function Home() {
  return (
    <>
      <Navbar/>
      <Hero />
      <Problems />
      <Vision />
      <Features />
      <Workflow />
      <Architecture />
      <Validation />
      <CTA />
    </>
  );
}

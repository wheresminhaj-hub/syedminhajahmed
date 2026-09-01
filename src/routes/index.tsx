import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/About";
import { AssistiveTouchCursor } from "@/components/AssistiveTouchCursor";
import { Contact, Footer } from "@/components/Contact";
import { EducationTimeline } from "@/components/EducationTimeline";
import { Hero } from "@/components/Hero";
import { IntroSequence } from "@/components/IntroSequence";
import { Navbar } from "@/components/Navbar";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { WhatIBuild } from "@/components/WhatIBuild";

const title = "Syed Minhaj Ahmed — AI/ML Engineer & CS Student Portfolio";
const description =
  "3D portfolio of Syed Minhaj Ahmed, a 3rd-year CS & Machine Learning student at Vaagdevi College of Engineering — building NutriCode and Nexus Hepta AI.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <IntroSequence />
      <AssistiveTouchCursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhatIBuild />
        <Projects />
        <Skills />
        <EducationTimeline />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

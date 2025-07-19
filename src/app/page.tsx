import { Header } from "@/components/Header";
import { TemplateCard } from "@/components/TemplateCard";
import { Code, Languages, TerminalSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            GenEdit
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered coding companion. Generate, explain, and chat your way through code with seamless AI integration.
          </p>
        </div>

        <div className="w-full max-w-4xl mt-16">
          <h2 className="text-2xl font-semibold mb-8">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <TemplateCard
              title="JavaScript"
              description="A vanilla JS project ready for the browser."
              href="/editor?template=js"
              icon={<Languages className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="Python"
              description="Start with a simple Python script."
              href="/editor?template=python"
              icon={<Code className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="HTML/CSS"
              description="Create a static webpage from scratch."
              href="/editor?template=html"
              icon={<TerminalSquare className="w-10 h-10 text-primary" />}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        Built with Next.js and Tailwind CSS.
      </footer>
    </div>
  );
}

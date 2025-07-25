import { Header } from "@/components/Header";
import { TemplateCard } from "@/components/TemplateCard";
import { Code, Languages, Orbit, Box, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter">
            CodeX
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered coding companion. Generate, explain, and chat your way through code with seamless AI integration.
          </p>
        </div>

        <div className="w-full max-w-6xl mt-16">
          <h2 className="text-2xl font-semibold mb-8">Choose a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <TemplateCard
              title="Web Project"
              description="A starter with HTML, CSS, and JavaScript."
              href="/editor?template=web"
              icon={<Globe className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="JavaScript"
              description="A blank canvas for your JavaScript code."
              href="/editor?template=javascript"
              icon={<Code className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="Python"
              description="Start with a simple Python script."
              href="/editor?template=python"
              icon={<Code className="w-10 h-10 text-primary" />}
            />
             <TemplateCard
              title="React"
              description="A basic client-side React example."
              href="/editor?template=react"
              icon={<Orbit className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="Vue.js"
              description="Get started with a simple Vue app."
              href="/editor?template=vue"
              icon={<Box className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="Java"
              description="A simple 'Hello, World!' in Java."
              href="/editor?template=java"
              icon={<Code className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="Go"
              description="A simple 'Hello, World!' in Go."
              href="/editor?template=go"
              icon={<Code className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="C#"
              description="A simple 'Hello, World!' in C#."
              href="/editor?template=csharp"
              icon={<Code className="w-10 h-10 text-primary" />}
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

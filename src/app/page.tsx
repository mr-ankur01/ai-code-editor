import { Header } from "@/components/Header";
import { TemplateCard } from "@/components/TemplateCard";
import { Code, Languages, Orbit, Box, Globe } from "lucide-react";

const CodeXml = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 17l-4-4 4-4" />
    <path d="M14 7l4 4-4 4" />
  </svg>
);

const BrandReact = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.383 15.383C11.383 15.383 11.002 16.968 9.362 17.632C7.721 18.296 6 17.632 6 17.632" />
    <path d="M12.617 15.383C12.617 15.383 12.998 16.968 14.638 17.632C16.279 18.296 18 17.632 18 17.632" />
    <path d="M12.617 8.617C12.617 8.617 12.998 7.032 14.638 6.368C16.279 5.704 18 6.368 18 6.368" />
    <path d="M11.383 8.617C11.383 8.617 11.002 7.032 9.362 6.368C7.721 5.704 6 6.368 6 6.368" />
    <path d="M15.383 11.383C15.383 11.383 16.968 11.002 17.632 9.362C18.296 7.721 17.632 6 17.632 6" />
    <path d="M15.383 12.617C15.383 12.617 16.968 12.998 17.632 14.638C18.296 16.279 17.632 18 17.632 18" />
    <path d="M8.617 12.617C8.617 12.617 7.032 12.998 6.368 14.638C5.704 16.279 6.368 18 6.368 18" />
    <path d="M8.617 11.383C8.617 11.383 7.032 11.002 6.368 9.362C5.704 7.721 6.368 6 6.368 6" />
    <ellipse cx="12" cy="12" rx="1" ry="1" />
  </svg>
);

const BrandVue = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        {...props}
    >
        <path d="M18.32 4H5.68a.5.5 0 0 0-.38.81l6.7 12.4a.5.5 0 0 0 .81 0l6.7-12.4a.5.5 0 0 0-.39-.81Z"/>
        <path d="M12 17.21 7.63 9.47h8.74L12 17.21Z"/>
    </svg>
);


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
              href="/editor/web"
              icon={<Globe className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="JavaScript"
              description="A blank canvas for your JavaScript code."
              href="/editor/javascript"
              icon={<CodeXml className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="Python"
              description="Start with a simple Python script."
              href="/editor/python"
              icon={<CodeXml className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="React"
              description="Start with a simple React component."
              href="/editor/react"
              icon={<BrandReact className="w-10 h-10 text-primary" />}
            />
             <TemplateCard
              title="Vue"
              description="Start with a simple Vue component."
              href="/editor/vue"
              icon={<BrandVue className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="Java"
              description="A simple 'Hello, World!' in Java."
              href="/editor/java"
              icon={<CodeXml className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="Go"
              description="A simple 'Hello, World!' in Go."
              href="/editor/go"
              icon={<CodeXml className="w-10 h-10 text-primary" />}
            />
            <TemplateCard
              title="C#"
              description="A simple 'Hello, World!' in C#."
              href="/editor/csharp"
              icon={<CodeXml className="w-10 h-10 text-primary" />}
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

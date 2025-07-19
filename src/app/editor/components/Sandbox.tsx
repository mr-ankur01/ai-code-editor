interface SandboxProps {
  content: string;
}

export function Sandbox({ content }: SandboxProps) {
  return (
    <iframe
      srcDoc={content}
      title="Website Output"
      sandbox="allow-scripts"
      className="w-full h-full border-0 bg-white"
    />
  );
}

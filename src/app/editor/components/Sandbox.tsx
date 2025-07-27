import * as React from 'react';

interface SandboxProps {
  content: string;
}

export const Sandbox = React.forwardRef<HTMLIFrameElement, SandboxProps>(
  ({ content }, ref) => {
    return (
      <iframe
        ref={ref}
        srcDoc={content}
        title="Website Output"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0 bg-white"
      />
    );
  }
);

Sandbox.displayName = 'Sandbox';

'use client';
import 'xterm/css/xterm.css';
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

interface RawTerminalProps {
  initialOutput?: string;
  onCommand?: (command: string) => void;
}

export function RawTerminal({ initialOutput, onCommand }: RawTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const commandRef = useRef<string>('');

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) {
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 14,
      theme: {
        background: 'hsl(var(--card))',
        foreground: 'hsl(var(--foreground))',
        cursor: 'hsl(var(--foreground))',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    
    // Display initial output if any
    if (initialOutput) {
        term.write(initialOutput.replace(/\n/g, '\r\n'));
    }

    const prompt = () => {
      commandRef.current = '';
      term.write('\r\n$ ');
    };

    prompt();

    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      if (domEvent.keyCode === 13) { // Enter
        term.write('\r\n');
        if (onCommand && commandRef.current) {
          onCommand(commandRef.current);
        } else {
          // Echo for now
          term.write(`command not found: ${commandRef.current}`);
        }
        prompt();
      } else if (domEvent.keyCode === 8) { // Backspace
        if (commandRef.current.length > 0) {
          term.write('\b \b');
          commandRef.current = commandRef.current.slice(0, -1);
        }
      } else if (printable) {
        commandRef.current += key;
        term.write(key);
      }
    });
    
    const handleResize = () => {
        fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      xtermRef.current = null;
    };
  }, [initialOutput, onCommand]);
  
  // Handle external output changes
  useEffect(() => {
    if (xtermRef.current && initialOutput) {
        // A bit of a hack to check if this is the first output
        if(!xtermRef.current.getBuffer().active.getLine(0)?.isWrapped) {
            xtermRef.current.clear();
            xtermRef.current.write(initialOutput.replace(/\n/g, '\r\n'));
            xtermRef.current.write('\r\n$ ');
        }
    }
  }, [initialOutput])

  return <div className="h-full w-full" ref={terminalRef} />;
}

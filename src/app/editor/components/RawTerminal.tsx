
'use client';
import 'xterm/css/xterm.css';
import React, { useEffect, useRef } from 'react';

interface RawTerminalProps {
  initialOutput?: string;
  onCommand?: (command: string) => void;
}

export function RawTerminal({ initialOutput, onCommand }: RawTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any | null>(null);
  const commandRef = useRef<string>('');
  const fitAddonRef = useRef<any | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!terminalRef.current || isInitialized.current) {
      return;
    }

    let term: any;
    
    const initTerminal = async () => {
        const { Terminal } = await import('xterm');
        const { FitAddon } = await import('xterm-addon-fit');
        const { WebLinksAddon } = await import('xterm-addon-web-links');

        term = new Terminal({
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
        xtermRef.current = term;
        
        const fitAddon = new FitAddon();
        fitAddonRef.current = fitAddon;
        
        term.loadAddon(fitAddon);
        term.loadAddon(new WebLinksAddon());
        
        term.open(terminalRef.current!);
        
        const safeFit = () => {
          if (terminalRef.current && terminalRef.current.clientHeight > 0 && terminalRef.current.clientWidth > 0) {
            try {
              fitAddon.fit();
            } catch (e) {
              console.error("Failed to fit terminal:", e);
            }
          }
        };

        setTimeout(safeFit, 1);
        
        isInitialized.current = true;

        if (initialOutput) {
            term.write(initialOutput.replace(/\n/g, '\r\n'));
        }

        const prompt = () => {
          commandRef.current = '';
          term.write('\r\n$ ');
        };
        prompt();

        term.onKey(({ key, domEvent }: { key: string, domEvent: KeyboardEvent }) => {
          const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

          if (domEvent.keyCode === 13) { // Enter
            term.write('\r\n');
            if (onCommand && commandRef.current) {
              onCommand(commandRef.current);
            } else {
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
    }

    initTerminal();
    
    const handleResize = () => {
        if (fitAddonRef.current) {
            if (terminalRef.current && terminalRef.current.clientHeight > 0 && terminalRef.current.clientWidth > 0) {
              try {
                fitAddonRef.current.fit();
              } catch (e) {
                console.error("Failed to fit terminal:", e);
              }
            }
        }
    };
    
    const resizeObserver = new ResizeObserver(handleResize);
    if (terminalRef.current?.parentElement) {
      resizeObserver.observe(terminalRef.current.parentElement);
    }
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (term) {
        term.dispose();
      }
      isInitialized.current = false;
    };
  }, []); // Run only once on mount

  // Handle external output changes
  useEffect(() => {
    if (xtermRef.current && initialOutput) {
        // This check is to prevent clearing and rewriting the terminal if the output is the same.
        // It's a simple check and might not cover all cases, but it helps prevent flicker.
        const currentBuffer = xtermRef.current.buffer.active.getLine(0)?.translateToString();
        if (currentBuffer && !currentBuffer.includes(initialOutput.split('\n')[0])) {
          xtermRef.current.clear();
          xtermRef.current.write(initialOutput.replace(/\n/g, '\r\n'));
          xtermRef.current.write('\r\n$ ');
        }
    }
  }, [initialOutput]);

  return <div className="absolute inset-0" ref={terminalRef} />;
}

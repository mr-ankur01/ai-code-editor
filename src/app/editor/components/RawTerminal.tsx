
'use client';
import 'xterm/css/xterm.css';
import React, { useEffect, useRef } from 'react';

interface RawTerminalProps {
  streamingOutput?: { content: string, key: number } | null;
  onCommand?: (command: string) => void;
}

export function RawTerminal({ streamingOutput, onCommand }: RawTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any | null>(null);
  const fitAddonRef = useRef<any | null>(null);
  const isInitialized = useRef(false);
  const lastKey = useRef<number | null>(null);

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

        if (streamingOutput) {
            term.write(streamingOutput.content.replace(/\n/g, '\r\n'));
            lastKey.current = streamingOutput.key;
        }

        const prompt = () => {
          term.write('\r\n$ ');
        };
        
        prompt();
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
    
    return () => {
      resizeObserver.disconnect();
      if (term) {
        term.dispose();
      }
      isInitialized.current = false;
    };
  }, []);

  useEffect(() => {
    if (xtermRef.current && streamingOutput) {
        if (lastKey.current !== streamingOutput.key) {
            // New execution, clear the terminal
            xtermRef.current.clear();
            lastKey.current = streamingOutput.key;
        }
        // Always write the full current content
        xtermRef.current.write('\r' + ' '.repeat(xtermRef.current.cols) + '\r'); // Clear line
        xtermRef.current.write(streamingOutput.content.replace(/\n/g, '\r\n'));
    }
  }, [streamingOutput]);


  return <div className="absolute inset-0" ref={terminalRef} />;
}


'use client';
import 'xterm/css/xterm.css';
import React, { useEffect, useRef } from 'react';

interface RawTerminalProps {
  simulationOutput?: string;
  executionOutput?: { output: string[], key: number } | null;
  onCommand?: (command: string) => void;
}

export function RawTerminal({ simulationOutput, executionOutput, onCommand }: RawTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any | null>(null);
  const commandRef = useRef<string>('');
  const fitAddonRef = useRef<any | null>(null);
  const isInitialized = useRef(false);
  const lastSimulationOutput = useRef('');

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

        if (simulationOutput) {
            term.write(simulationOutput.replace(/\n/g, '\r\n'));
            lastSimulationOutput.current = simulationOutput;
        }

        const prompt = () => {
          commandRef.current = '';
          term.write('\r\n$ ');
        };
        
        if (!simulationOutput) {
          prompt();
        }


        term.onKey(({ key, domEvent }: { key: string, domEvent: KeyboardEvent }) => {
          const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

          if (domEvent.keyCode === 13) { // Enter
            if (onCommand && commandRef.current) {
              onCommand(commandRef.current);
            } else {
              term.write(`\r\ncommand not found: ${commandRef.current}`);
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

  // Handle AI simulation output changes
  useEffect(() => {
    if (xtermRef.current && simulationOutput && simulationOutput !== lastSimulationOutput.current) {
        xtermRef.current.write(simulationOutput.replace(lastSimulationOutput.current, '').replace(/\n/g, '\r\n'));
        lastSimulationOutput.current = simulationOutput;
    }
  }, [simulationOutput]);

  // Handle direct JS execution output
  useEffect(() => {
    if (xtermRef.current && executionOutput) {
        xtermRef.current.clear();
        executionOutput.output.forEach((line: string) => {
            xtermRef.current.writeln(line);
        });
        xtermRef.current.write('$ ');
    }
  }, [executionOutput]);

  return <div className="absolute inset-0" ref={terminalRef} />;
}

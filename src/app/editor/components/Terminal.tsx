'use client';
import 'xterm/css/xterm.css';
import React, { useEffect, useRef } from 'react';
import { Terminal as XtermTerminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

interface TerminalProps {
  output: string;
}

export function Terminal({ output }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XtermTerminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const term = new XtermTerminal({
        convertEol: true,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 14,
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
        },
        cursorBlink: true,
        rows: 15,
      });
      const fitAddon = new FitAddon();

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();
    }
  }, []);

  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      // Replace newline characters with carriage return + newline for proper xterm rendering
      const formattedOutput = output.replace(/\n/g, '\r\n');
      xtermRef.current.write(formattedOutput);
    }
  }, [output]);

  useEffect(() => {
    const handleResize = () => {
      fitAddonRef.current?.fit();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div className="h-full w-full" ref={terminalRef} />;
}

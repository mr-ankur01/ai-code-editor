import { Terminal } from './Terminal';

interface OutputTabsProps {
  terminalOutput: string;
}

export function OutputTabs({ terminalOutput }: OutputTabsProps) {
  return (
    <div className="w-full h-full p-2">
      <Terminal output={terminalOutput} />
    </div>
  );
}

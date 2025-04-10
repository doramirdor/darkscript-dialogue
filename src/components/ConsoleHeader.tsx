
import React from 'react';

interface ConsoleHeaderProps {
  title: string;
  children?: React.ReactNode;
}

const ConsoleHeader: React.FC<ConsoleHeaderProps> = ({ title, children }) => {
  return (
    <div className="flex items-center justify-between py-2 px-4 border-b border-[var(--vscode-border)]">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-red-500 mx-1"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500 mx-1"></div>
        <div className="w-3 h-3 rounded-full bg-green-500 mx-1"></div>
        <span className="ml-2 font-medium text-sm">{title}</span>
      </div>
      {children}
    </div>
  );
};

export default ConsoleHeader;

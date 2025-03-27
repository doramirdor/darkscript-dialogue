
import React from 'react';
import ConsoleInterface from '@/components/ConsoleInterface';

const Index = () => {
  // Add class to body to enable VS Code styling
  React.useEffect(() => {
    document.body.classList.add('vscode-dark');
    return () => {
      document.body.classList.remove('vscode-dark');
    };
  }, []);

  return <ConsoleInterface />;
};

export default Index;

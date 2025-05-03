import React from 'react';

interface StatusBarProps {
  language: string;
  theme: string;
  position?: { line: number; col: number };
}

const StatusBar: React.FC<StatusBarProps> = ({ language, theme, position = { line: 1, col: 1 } }) => {
  // Helper function to properly display language name
  const formatLanguageName = (lang: string) => {
    switch (lang) {
      case 'javascript':
        return 'JavaScript';
      case 'typescript':
        return 'TypeScript';
      case 'python':
        return 'Python';
      default:
        return lang.charAt(0).toUpperCase() + lang.slice(1);
    }
  };

  return (
    <div className={`flex items-center justify-between px-4 py-1 text-xs ${
      theme === 'dark' ? 'bg-[#252525] text-gray-300' : 'bg-[#e8e5dd] text-[#0d3528]'
    }`}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center">
          <span className="project-blackbird-font">Language:</span>
          <span className="ml-1 font-medium">{formatLanguageName(language)}</span>
        </div>
        
        <div className="flex items-center">
          <span className="project-blackbird-font">Theme:</span>
          <span className="ml-1 font-medium capitalize">{theme}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div>
          <span className="project-blackbird-font">Line {position.line}, Column {position.col}</span>
        </div>
        
        <div>
          <span className="project-blackbird-font">UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 
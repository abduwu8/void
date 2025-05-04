import { useState } from 'react';
import JS2FlowchartVisualizer from './JS2FlowchartVisualizer';

interface VisualizeButtonProps {
  code: string;
  language: string;
}

const VisualizeButton = ({ code, language }: VisualizeButtonProps) => {
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  
  // Only show for JavaScript
  if (language !== 'javascript' && language !== 'typescript') {
    return null;
  }

  return (
    <>
      <button 
        onClick={() => setIsVisualizerOpen(true)}
        className="bg-[#1e3e35] hover:bg-[#2a4f45] text-white px-3 py-1.5 rounded-md text-sm project-blackbird-font transition-colors flex items-center border border-[#0d3528]/50 space-x-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/30"
        title="Visualize code"
        aria-label="Visualize code"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
        <span>Visualize</span>
      </button>
      
      <JS2FlowchartVisualizer
        isOpen={isVisualizerOpen}
        onClose={() => setIsVisualizerOpen(false)}
        jsCode={code}
      />
    </>
  );
};

export default VisualizeButton; 
import React, { useState } from 'react';

interface SaveCodeButtonProps {
  code: string;
  language: string;
}

const SaveCodeButton: React.FC<SaveCodeButtonProps> = ({ code, language }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Get appropriate file extension based on current language
  const getDefaultExtension = (): string => {
    switch (language) {
      case 'javascript':
        return '.js';
      case 'typescript':
        return '.ts';
      case 'python':
        return '.py';
      case 'html':
        return '.html';
      case 'css':
        return '.css';
      default:
        return '.txt';
    }
  };
  
  // Get default filename based on language
  const getDefaultFilename = (): string => {
    switch (language) {
      case 'javascript':
        return 'code.js';
      case 'typescript':
        return 'code.ts';
      case 'python':
        return 'code.py';
      case 'html':
        return 'index.html';
      case 'css':
        return 'styles.css';
      default:
        return 'code.txt';
    }
  };

  // Save with specific extension
  const saveAs = (extension: string) => {
    let filename = '';
    let content = code;
    
    // Determine filename and potentially modify content based on extension
    switch (extension) {
      case '.js':
        filename = 'code.js';
        break;
      case '.ts':
        filename = 'code.ts';
        break;
      case '.py':
        filename = 'code.py';
        break;
      case '.html':
        filename = 'index.html';
        break;
      case '.css':
        filename = 'styles.css';
        break;
      default:
        filename = getDefaultFilename();
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Close dropdown after saving
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button 
        className="bg-[#1e3e35] hover:bg-[#2a4f45] text-white px-3 py-1 rounded text-sm project-blackbird-font transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        Save As
      </button>
      
      {showDropdown && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10">
          <ul className="py-1">
            <li>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 project-blackbird-font"
                onClick={() => saveAs('.js')}
              >
                JavaScript (.js)
              </button>
            </li>
            <li>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 project-blackbird-font"
                onClick={() => saveAs('.ts')}
              >
                TypeScript (.ts)
              </button>
            </li>
            <li>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 project-blackbird-font"
                onClick={() => saveAs('.py')}
              >
                Python (.py)
              </button>
            </li>
            <li>
              <button 
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 project-blackbird-font"
                onClick={() => saveAs(getDefaultExtension())}
              >
                Current Format ({getDefaultExtension()})
              </button>
            </li>
          </ul>
        </div>
      )}
      
      {/* Invisible overlay to detect clicks outside dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default SaveCodeButton; 
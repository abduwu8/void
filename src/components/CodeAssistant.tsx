import React, { useState, useEffect, useRef } from 'react';
import { GroqService } from '../services/groqService';
import { GROQ_API_KEY } from '../config/api';

interface CodeAssistantProps {
  code: string;
  language: string;
  theme: string;
  onClose: () => void;
  isVisible: boolean;
  onInsertCode?: (code: string) => void;
}

// Different modes the assistant can operate in
type AssistantMode = 'suggest' | 'explain' | 'debug';

const CodeAssistant: React.FC<CodeAssistantProps> = ({ 
  code, 
  language, 
  theme, 
  onClose,
  isVisible,
  onInsertCode 
}) => {
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AssistantMode>('suggest');
  const [autoAnalyze, setAutoAnalyze] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const groqService = useRef<GroqService | null>(null);
  const debounceTimer = useRef<number | null>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Initialize Groq service on component mount with the provided API key
  useEffect(() => {
    try {
      // Initialize with the predefined API key
      groqService.current = new GroqService(GROQ_API_KEY);
      if (groqService.current) {
        setDebugInfo(prev => prev + "\nGroq service initialized successfully");
      } else {
        setDebugInfo(prev => prev + "\nFailed to initialize Groq service");
      }
      
      // Check for saved settings on component mount
      const savedAutoAnalyze = localStorage.getItem('autoAnalyze');
      
      if (savedAutoAnalyze !== null) {
        setAutoAnalyze(savedAutoAnalyze === 'true');
      }
      
      // Test the API with a simple request
      testApiConnection();
    } catch (err) {
      console.error("Error in initialization:", err);
      setDebugInfo(prev => prev + `\nError during initialization: ${err}`);
    }
  }, []);

  // Test API connection
  const testApiConnection = async () => {
    try {
      if (!groqService.current) {
        setDebugInfo(prev => prev + "\nNo Groq service available for test");
        return;
      }
      
      setDebugInfo(prev => prev + "\nTesting API connection...");
      const testResponse = await groqService.current.testConnection();
      setDebugInfo(prev => prev + `\nAPI test response: ${testResponse ? 'Success' : 'Failed'}`);
    } catch (err) {
      console.error("API test error:", err);
      setDebugInfo(prev => prev + `\nAPI test error: ${err}`);
    }
  };

  // Update settings when auto-analyze preferences change
  useEffect(() => {
    // Save settings
    localStorage.setItem('autoAnalyze', String(autoAnalyze));
  }, [autoAnalyze]);

  // Debounced function to get assistance after user stops typing
  useEffect(() => {
    if (!isVisible || !code.trim() || !autoAnalyze || !groqService.current) return;

    // Clear previous timer
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    // Set new timer
    debounceTimer.current = window.setTimeout(async () => {
      getAssistance();
    }, 1500); // 1.5 second delay

    // Cleanup timer on unmount
    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, [code, language, isVisible, autoAnalyze, mode]);

  // Function to get assistance based on current mode
  const getAssistance = async () => {
    if (!groqService.current) {
      setError("Groq service not available");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setDebugInfo(prev => prev + `\nRequesting assistance in ${mode} mode...`);
    
    try {
      let result = '';
      
      switch (mode) {
        case 'explain':
          result = await groqService.current.getExplanation(code, language);
          break;
        case 'debug':
          result = await groqService.current.getDebugHelp(code, language);
          break;
        case 'suggest':
        default:
          result = await groqService.current.getAssistance(code, language);
          break;
      }
      
      setDebugInfo(prev => prev + `\nReceived response: ${result.substring(0, 50)}...`);
      
      if (!result || result.trim() === '') {
        setError("Received empty response from API");
        setDebugInfo(prev => prev + "\nEmpty response received");
      } else {
        setSuggestion(result);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('Error getting code suggestions:', err);
      setError(`Failed to get suggestions: ${errorMessage}`);
      setDebugInfo(prev => prev + `\nError: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Request assistance manually
  const handleManualRequest = () => {
    getAssistance();
  };

  // Handle inserting code directly into the editor
  const handleInsertCode = () => {
    if (!onInsertCode || !suggestion) return;
    
    // Extract code blocks from suggestion
    const codeBlockRegex = /```(?:.*\n)?([\s\S]*?)```/g;
    let match;
    const codeBlocks = [];
    
    while ((match = codeBlockRegex.exec(suggestion)) !== null) {
      codeBlocks.push(match[1].trim());
    }
    
    // Insert the first code block found or the entire suggestion if no code blocks
    if (codeBlocks.length > 0) {
      onInsertCode(codeBlocks[0]);
    }
  };

  // Toggle auto-analysis
  const toggleAutoAnalyze = () => {
    setAutoAnalyze(prev => !prev);
  };

  // Clear error and debug info
  const handleClearDebug = () => {
    setDebugInfo('');
    setError(null);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed right-4 bottom-20 w-96 rounded-lg shadow-lg overflow-hidden ${
      theme === 'dark' ? 'bg-[#252525] text-gray-300' : 'bg-white text-[#0d3528]'
    } transition-all duration-300`}>
      {/* Header */}
      <div className={`px-4 py-3 flex justify-between items-center ${
        theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-[#f8f5ed]'
      }`}>
        <h3 className="text-sm font-medium project-blackbird-font">void assistant</h3>
        <div className="flex space-x-2">
          <button 
            onClick={toggleAutoAnalyze} 
            className={`text-xs rounded px-2 py-1 project-blackbird-font ${
              autoAnalyze 
                ? (theme === 'dark' ? 'bg-green-800' : 'bg-green-100 text-green-800') 
                : (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200')
            }`}
            title={autoAnalyze ? "Auto-analyze is on" : "Auto-analyze is off"}
          >
            Auto
          </button>
          <button 
            onClick={onClose} 
            className="text-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Mode selector */}
        <div className={`flex border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {(['suggest', 'explain', 'debug'] as AssistantMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 text-xs py-2 project-blackbird-font transition-colors ${
                mode === m 
                  ? (theme === 'dark' ? 'bg-[#333] text-white' : 'bg-[#0d3528]/10 text-[#0d3528]')
                  : ''
              }`}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Manual trigger button */}
        <div className={`py-2 px-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={handleManualRequest}
            className="w-full bg-[#0d3528] text-white py-1 rounded text-xs project-blackbird-font hover:bg-[#174f3f]"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Analyze Code Now'}
          </button>
        </div>
        
        {/* Result area */}
        <div className="max-h-[350px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <div className="loader animate-pulse project-blackbird-font">
                {mode === 'suggest' && 'Analyzing your code...'}
                {mode === 'explain' && 'Generating explanation...'}
                {mode === 'debug' && 'Debugging your code...'}
              </div>
            </div>
          ) : error ? (
            <div className="py-2 px-4">
              <p className="text-red-500 text-xs mb-2">{error}</p>
              <details className="text-xs mb-2">
                <summary className="cursor-pointer text-gray-400 project-blackbird-font">Debug Information</summary>
                <pre className="mt-2 p-2 bg-gray-800 rounded text-gray-300 whitespace-pre-wrap text-[10px]">
                  {debugInfo || 'No debug information available'}
                </pre>
              </details>
              <button
                onClick={handleClearDebug}
                className="text-xs text-[#0d3528] hover:underline project-blackbird-font"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="py-2 px-4" ref={suggestionRef}>
              {suggestion ? (
                <div className="text-xs leading-5 whitespace-pre-wrap project-blackbird-font">
                  {suggestion}
                </div>
              ) : (
                <div>
                  <p className="text-xs leading-5 project-blackbird-font">
                    {mode === 'suggest' && "I'll analyze your code and provide suggestions as you type."}
                    {mode === 'explain' && "I'll explain your code in detail."}
                    {mode === 'debug' && "I'll help identify and fix bugs in your code."}
                  </p>
                  
                  {/* Debug info when no suggestion is available */}
                  <details className="text-xs mt-4">
                    <summary className="cursor-pointer text-gray-400 project-blackbird-font">Debug Information</summary>
                    <pre className="mt-2 p-2 bg-gray-800 rounded text-gray-300 whitespace-pre-wrap text-[10px]">
                      {debugInfo || 'No debug information available'}
                    </pre>
                    <button
                      onClick={handleClearDebug}
                      className="mt-2 text-xs text-[#0d3528] hover:underline project-blackbird-font"
                    >
                      Clear
                    </button>
                  </details>
                </div>
              )}
              
              {/* Display insert code button when there's a suggestion and onInsertCode is available */}
              {suggestion && onInsertCode && mode === 'debug' && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleInsertCode}
                    className="bg-[#0d3528] text-white px-3 py-1 rounded text-xs project-blackbird-font hover:bg-[#174f3f]"
                  >
                    Insert Fix
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Language-specific tips */}
        {!isLoading && !error && suggestion && (
          <div className={`px-4 py-2 text-xs border-t ${
            theme === 'dark' ? 'border-gray-700 bg-[#1e1e1e]' : 'border-gray-200 bg-[#f8f5ed]/50'
          }`}>
            <div className="flex justify-between items-center">
              <span className="project-blackbird-font font-medium">Tips for {language}</span>
            </div>
            {language === 'javascript' && (
              <p className="mt-1 project-blackbird-font">💡 Try using modern ES6+ features like arrow functions and destructuring.</p>
            )}
            {language === 'typescript' && (
              <p className="mt-1 project-blackbird-font">💡 Leverage TypeScript's type system for better code quality.</p>
            )}
            {language === 'python' && (
              <p className="mt-1 project-blackbird-font">💡 Remember to use list comprehensions for more pythonic code.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeAssistant; 
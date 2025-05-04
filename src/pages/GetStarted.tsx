import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import StatusBar from '../components/StatusBar'
import SaveCodeButton from '../components/SaveCodeButton'
import VisualizeButton from '../components/VisualizeButton'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { php } from '@codemirror/lang-php'
import { rust } from '@codemirror/lang-rust'
import { sql } from '@codemirror/lang-sql'
import { xml } from '@codemirror/lang-xml'
import { StreamLanguage } from '@codemirror/language'
import { csharp } from '@codemirror/legacy-modes/mode/clike'
import { EditorView } from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'
import CodeAssistant from '../components/CodeAssistant'

const GetStarted: React.FC = () => {
  // State management
  const [code, setCode] = useState<string>(`// Welcome to void IDE
// Try writing some code here

function greet(name) {
  return \`Hello, \${name}! Welcome to void IDE.\`;
}

console.log(greet('developer'));
`);
  const [output, setOutput] = useState<string>("");
  const [theme, setTheme] = useState<string>("dark");
  const [language, setLanguage] = useState<string>("javascript");
  const [cursorPosition, setCursorPosition] = useState<{ line: number; col: number }>({ line: 1, col: 1 });
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [showAssistant, setShowAssistant] = useState<boolean>(false);
  
  // Refs
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  // Sample code for different languages
  const sampleCode: Record<string, string> = {
    javascript: `// Welcome to void IDE
// Try writing some code here

function greet(name) {
  return \`Hello, \${name}! Welcome to void IDE.\`;
}

console.log(greet('developer'));`,

    typescript: `// Welcome to void IDE
// Try writing some code in TypeScript

function greet(name: string): string {
  return \`Hello, \${name}! Welcome to void IDE.\`;
}

console.log(greet('developer'));`,

    python: `# Welcome to void IDE
# Try writing some code here

def greet(name):
    return f"Hello, {name}! Welcome to void IDE."

print(greet("developer"))`,

    html: `<!-- Welcome to void IDE -->
<!DOCTYPE html>
<html>
<head>
  <title>void IDE</title>
</head>
<body>
  <h1>Hello, developer!</h1>
  <p>Welcome to void IDE.</p>
</body>
</html>`,

    css: `/* Welcome to void IDE */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
  border-bottom: 2px solid #0d3528;
}`,

    java: `// Welcome to void IDE
// Try writing some Java code here

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println(greet("developer"));
    }
    
    public static String greet(String name) {
        return "Hello, " + name + "! Welcome to void IDE.";
    }
}`,

    rust: `// Welcome to void IDE
// Try writing some Rust code here

fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to void IDE.", name)
}

fn main() {
    println!("{}", greet("developer"));
}`,

    php: `<?php
// Welcome to void IDE
// Try writing some PHP code here

function greet($name) {
    return "Hello, $name! Welcome to void IDE.";
}

echo greet("developer");
?>`,

    sql: `-- Welcome to void IDE
-- Try writing some SQL code here

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
);

INSERT INTO users (name, email) VALUES ('developer', 'dev@example.com');

SELECT * FROM users WHERE name = 'developer';`,

    csharp: `// Welcome to void IDE
// Try writing some C# code here

using System;

class Program {
    static string Greet(string name) {
        return $"Hello, {name}! Welcome to void IDE.";
    }
    
    static void Main() {
        Console.WriteLine(Greet("developer"));
    }
}`,

    xml: `<?xml version="1.0" encoding="UTF-8"?>
<!-- Welcome to void IDE -->
<root>
  <greeting>
    <message>Hello, developer! Welcome to void IDE.</message>
  </greeting>
</root>`,
  };

  // Ensure there's no gap by forcing the elements to touch
  useEffect(() => {
    const ensureNoGap = () => {
      if (editorContainerRef.current && consoleContainerRef.current) {
        // Force the editor to take up the exact space needed
        const editorHeight = editorContainerRef.current.getBoundingClientRect().height;
        editorContainerRef.current.style.height = `${Math.floor(editorHeight)}px`;
        
        // Force the console to sit directly against the editor
        consoleContainerRef.current.style.marginTop = '0px';
      }
    };
    
    ensureNoGap();
    // Re-check after a brief delay to account for any rendering delays
    const timeout = setTimeout(ensureNoGap, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  // Update code when language changes
  useEffect(() => {
    if (sampleCode[language]) {
      setCode(sampleCode[language]);
    }
  }, [language]);

  // Get language extension based on selected language
  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript': return javascript();
      case 'typescript': return javascript({ typescript: true });
      case 'html': return html();
      case 'css': return css();
      case 'python': return python();
      case 'java': return java();
      case 'php': return php();
      case 'rust': return rust();
      case 'sql': return sql();
      case 'xml': return xml();
      case 'csharp': return StreamLanguage.define(csharp);
      default: return javascript();
    }
  };

  // Get theme based on selected theme
  const getTheme = () => {
    return theme === 'dark' ? oneDark : EditorView.theme({
      "&": {
        backgroundColor: "#f8f8f8",
        color: "#333"
      },
      ".cm-content": {
        caretColor: "#0d3528"
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: "#0d3528"
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: "#d7ede7"
      }
    });
  };

  // Handle code execution
  const executeCode = () => {
    setIsExecuting(true);
    
    try {
      if (language === 'javascript' || language === 'typescript') {
        // Create a mock console.log
        const originalConsoleLog = console.log;
        const logs: string[] = [];
        
        console.log = (...args: any[]) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
          ).join(' '));
        };
        
        // Run the code
        // eslint-disable-next-line no-new-func
        new Function(code)();
        
        // Restore the original console.log
        console.log = originalConsoleLog;
        
        // Display the output
        setOutput(logs.join('\n'));
        setIsExecuting(false);
      } else if (language === 'python') {
        setOutput("Loading Python interpreter...");
        
        // Load Pyodide dynamically
        const loadPyodide = async () => {
          try {
            // Check if pyodide is already loaded
            if (!(window as any).loadPyodide) {
              const script = document.createElement('script');
              script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
              document.head.appendChild(script);
              
              // Wait for script to load
              await new Promise<void>((resolve, reject) => {
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("Failed to load Pyodide"));
              });
            }
            
            // Load Pyodide
            const pyodide = await (window as any).loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
            });
            
            // Redirect stdout to capture print statements
            pyodide.runPython(`
              import sys
              import io
              sys.stdout = io.StringIO()
            `);
            
            // Run the actual code
            pyodide.runPython(code);
            
            // Get stdout content
            const stdout = pyodide.runPython("sys.stdout.getvalue()");
            
            // Display the output
            setOutput(stdout || "Code executed successfully with no output.");
          } catch (error: any) {
            setOutput(`Python Error: ${error.message}`);
          } finally {
            setIsExecuting(false);
          }
        };
        
        loadPyodide();
      } else {
        setOutput(`Language ${language} is not supported for execution in the browser.`);
        setIsExecuting(false);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setOutput(`Error: ${errorMessage}`);
      setIsExecuting(false);
    }
  };

  // Handle cursor position change
  const handleCursorChange = (viewUpdate: any) => {
    const selection = viewUpdate.state.selection.main;
    setCursorPosition({
      line: selection.head ? viewUpdate.state.doc.lineAt(selection.head).number : 1,
      col: selection.head ? selection.head - viewUpdate.state.doc.lineAt(selection.head).from + 1 : 1
    });
  };

  // Handle code insertion from AI assistant
  const handleCodeInsertion = (generatedCode: string) => {
    setCode(prevCode => {
      // If there's no existing code or cursor is at beginning, just use the generated code
      if (!prevCode.trim()) {
        return generatedCode;
      }
      
      // Otherwise, try to insert at a reasonable position or append to the end
      return prevCode + '\n\n' + generatedCode;
    });
  };

  return (
    <section id="get-started" className="min-h-screen w-full relative overflow-hidden">
      {/* Background styling */}
      <div className="fixed inset-0 -z-10" style={{ 
        background: 'linear-gradient(to bottom, #f8f5ed, #f2f0e6)',
        overflow: 'hidden'
      }}/>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-28 max-w-6xl">
        <div className="w-full mx-auto">
          <div className="flex flex-col mb-10">
            <h1 className="text-6xl md:text-7xl text-green-800 project-blackbird-font font-bold mb-6">
              get started
            </h1>
            
            <p className="text-[#0d3528] project-blackbird-font text-xl mb-3 max-w-3xl">
              try void IDE right in your browser. write and execute code instantly with notes and code visualization.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0d3528]/10 text-[#0d3528] text-sm project-blackbird-font">
                <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                JavaScript
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0d3528]/10 text-[#0d3528] text-sm project-blackbird-font">
                <span className="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                TypeScript
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0d3528]/10 text-[#0d3528] text-sm project-blackbird-font">
                <span className="w-2 h-2 rounded-full bg-yellow-600 mr-2"></span>
                Python
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0d3528]/10 text-[#0d3528] text-sm project-blackbird-font">
                <span className="w-2 h-2 rounded-full bg-purple-600 mr-2"></span>
                Notes
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#0d3528]/10 text-[#0d3528] text-sm project-blackbird-font">
                <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
                Code Visualization
              </span>
            </div>
            
            <div className="text-base text-[#0d3528]/80 project-blackbird-font flex items-center">
              <span className="inline-flex items-center px-2 py-1 mr-2 bg-[#1e3e35] text-white rounded-sm text-xs">
                <span className="mr-1">AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              </span>
              <span>Click the AI button for intelligent coding assistance.</span>
            </div>
          </div>
          
          {/* IDE Container */}
          <div className="border-2 border-[#0d3528] rounded-lg overflow-hidden shadow-2xl"
               style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto' }}>
            {/* IDE Header with controls */}
            <div className="bg-[#0d3528] text-white p-3 px-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm project-blackbird-font flex items-center">
                  <span className="text-white/70 hidden sm:inline mr-1">void_ide ~</span>
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {language === 'javascript' && 'script.js'}
                    {language === 'typescript' && 'script.ts'}
                    {language === 'python' && 'script.py'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <select 
                  className="bg-[#1e3e35] hover:bg-[#2a4f45] text-white text-sm rounded-md px-3 py-1.5 project-blackbird-font border border-[#0d3528]/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-colors"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  aria-label="Select programming language"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                </select>
                
                <select 
                  className="bg-[#1e3e35] hover:bg-[#2a4f45] text-white text-sm rounded-md px-3 py-1.5 project-blackbird-font border border-[#0d3528]/50 focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-colors"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  aria-label="Select theme"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
                
                <VisualizeButton code={code} language={language} />
                
                <button 
                  className="bg-[#1e3e35] hover:bg-[#2a4f45] text-white px-3 py-1.5 rounded-md text-sm project-blackbird-font transition-colors flex items-center border border-[#0d3528]/50 space-x-1.5 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  onClick={() => setShowAssistant(!showAssistant)}
                  title="Toggle AI Assistant"
                  aria-label="Toggle AI Assistant"
                >
                  <span>AI</span>
                  <span className={`inline-block w-2 h-2 rounded-full ${showAssistant ? 'bg-green-400' : 'bg-gray-400'}`}></span>
                </button>
                
                <SaveCodeButton code={code} language={language} />
                
                <button 
                  className={`${
                    isExecuting 
                      ? 'bg-gray-600 cursor-wait' 
                      : 'bg-green-600 hover:bg-green-700 cursor-pointer'
                  } text-white px-4 py-1.5 rounded-md text-sm project-blackbird-font transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30 font-medium`}
                  onClick={executeCode}
                  disabled={isExecuting}
                >
                  {isExecuting ? 'Running...' : 'Run'}
                </button>
              </div>
            </div>
            
            {/* Main IDE area with editor and console */}
            <div className="flex" style={{ height: '65vh' }}>
              {/* Unified container for editor and console with no gap */}
              <div className="flex flex-col flex-grow" style={{ overflow: 'hidden' }}>
                {/* CodeMirror Editor */}
                <div ref={editorContainerRef} className="flex-grow" style={{ display: 'block', position: 'relative', margin: 0, padding: 0, overflow: 'hidden' }}>
                  <CodeMirror
                    value={code}
                    height="100%"
                    extensions={[getLanguageExtension()]}
                    theme={getTheme()}
                    onChange={setCode}
                    onUpdate={handleCursorChange}
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLineGutter: true,
                      highlightSpecialChars: true,
                      foldGutter: true,
                      dropCursor: true,
                      allowMultipleSelections: true,
                      indentOnInput: true,
                      syntaxHighlighting: true,
                      bracketMatching: true,
                      closeBrackets: true,
                      autocompletion: true,
                      rectangularSelection: true,
                      crosshairCursor: true,
                      highlightActiveLine: true,
                      highlightSelectionMatches: true,
                      closeBracketsKeymap: true,
                      searchKeymap: true,
                      foldKeymap: true,
                      completionKeymap: true,
                      lintKeymap: true,
                    }}
                    style={{
                      fontSize: '14px',
                    }}
                  />
                </div>
                
                {/* Console Output */}
                <div ref={consoleContainerRef} className={`${theme === 'dark' ? 'bg-[#1e1e1e] text-white' : 'bg-[#f0f0f0] text-[#333]'}`} style={{ marginTop: '-1px', boxSizing: 'border-box', height: '15vh' }}>
                  <div className={`p-2 px-4 ${theme === 'dark' ? 'bg-[#252525]' : 'bg-[#e5e5e5]'}`}>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} project-blackbird-font flex items-center`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Console Output
                    </span>
                  </div>
                  <pre className={`font-mono text-sm whitespace-pre-wrap overflow-y-auto p-4 h-full ${theme === 'dark' ? '' : 'text-gray-800'}`}>
                    {output || (theme === 'dark' 
                      ? "// Code execution results will appear here" 
                      : "// Code execution results will appear here")}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Status Bar */}
            <StatusBar 
              language={language}
              theme={theme}
              position={cursorPosition}
            />
          </div>
          
          {/* AI Assistant */}
          <CodeAssistant
            code={code}
            language={language}
            theme={theme}
            onClose={() => setShowAssistant(false)}
            isVisible={showAssistant}
            onInsertCode={handleCodeInsertion}
          />
        </div>
      </div>
    </section>
  )
}

export default GetStarted

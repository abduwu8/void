import { useState, useEffect, useRef } from 'react';

interface JS2FlowchartVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  jsCode: string;
}

const JS2FlowchartVisualizer = ({ isOpen, onClose, jsCode }: JS2FlowchartVisualizerProps) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && jsCode) {
      generateFlowchart(jsCode);
    }
  }, [isOpen, jsCode]);

  // Function to load js2flowchart and generate the flowchart
  const generateFlowchart = async (code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load js2flowchart from CDN if it's not already loaded
      if (!(window as any).js2flowchart) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/js2flowchart@1.3.4/dist/js2flowchart.min.js";
        script.async = true;
        
        const loadPromise = new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load js2flowchart library'));
        });
        
        document.head.appendChild(script);
        await loadPromise;
      }
      
      // Generate the flowchart SVG
      const js2flowchart = (window as any).js2flowchart;
      if (!js2flowchart) {
        throw new Error('js2flowchart failed to load');
      }
      
      const svg = js2flowchart.convertCodeToSvg(code);
      setSvgContent(svg);
      
      // Apply custom styling to the SVG after it's rendered
      setTimeout(() => {
        if (containerRef.current) {
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            // Customize the SVG appearance
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('height', '100%');
            
            // Apply styles to match the void IDE theme
            const elements = svgElement.querySelectorAll('rect, path, polygon');
            elements.forEach((el: Element) => {
              if (el.getAttribute('fill') === 'white') {
                el.setAttribute('fill', '#f8f5ed'); // Use theme background color
              }
              
              if (el.getAttribute('stroke') === 'black') {
                el.setAttribute('stroke', '#0d3528'); // Use theme primary color
              }
            });
            
            // Style text elements
            const textElements = svgElement.querySelectorAll('text');
            textElements.forEach((el: Element) => {
              el.setAttribute('fill', '#0d3528');
              el.setAttribute('font-family', 'Arial, sans-serif');
            });
          }
        }
      }, 100);
    } catch (err) {
      console.error('Error generating flowchart:', err);
      setError('Error parsing JavaScript code. Make sure your code is valid JavaScript.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportAsSvg = () => {
    if (!svgContent) return;
    
    // Create a Blob with the SVG content
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'js-flowchart.svg';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/20 backdrop-blur-sm">
      <div className="bg-[#f8f5ed] rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#0d3528]/10">
          <h3 className="text-sm text-[#0d3528] font-medium project-blackbird-font">JavaScript Code Flowchart</h3>
          <button 
            onClick={onClose}
            className="text-[#0d3528]/60 hover:text-[#0d3528] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="p-4 max-h-[calc(85vh-8rem)] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0d3528]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-sm">{error}</p>
              <p className="text-[#0d3528]/70 text-xs mt-2">Only JavaScript code can be visualized</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-[#0d3528]/70 project-blackbird-font">Generated Flowchart</p>
                <button 
                  onClick={exportAsSvg}
                  className="text-xs text-[#0d3528] px-3 py-1 rounded-full bg-[#0d3528]/5 hover:bg-[#0d3528]/10 transition-colors project-blackbird-font flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export as SVG
                </button>
              </div>
              
              <div className="border border-[#0d3528]/10 rounded-lg p-4 bg-white">
                <div 
                  ref={containerRef}
                  className="w-full h-[500px] overflow-auto" 
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                ></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-[#0d3528]/10">
          <p className="text-xs text-[#0d3528]/50 project-blackbird-font text-center">
            This visualizer generates flowcharts from JavaScript code in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JS2FlowchartVisualizer; 
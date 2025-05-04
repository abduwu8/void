import { useState } from 'react'
import AbstractShapes from '../components/AbstractShapes'

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  toggleAccordion: () => void;
  index: number;
}

const FAQItem = ({ question, answer, isOpen, toggleAccordion, index }: FAQItemProps) => {
  return (
    <div 
      className="py-4 transform transition-all duration-300 hover:translate-x-1"
      style={{ 
        transitionDelay: `${index * 50}ms` 
      }}
    >
      <button 
        className="flex justify-between items-center w-full text-left group"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg text-[#0d3528] font-bold project-blackbird-font group-hover:text-[#174f3f] transition-colors duration-300">{question}</h3>
        <span className={`ml-6 text-[#0d3528] h-6 w-6 flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-45 transform' : ''}`}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      <div 
        className={`mt-2 text-[#0d3528]/80 overflow-hidden transition-all duration-500 project-blackbird-font ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
        }}
      >
        <div 
          className="text-sm leading-relaxed pr-6 transform transition-all duration-500"
          style={{ 
            transform: isOpen ? 'translateY(0)' : 'translateY(-10px)', 
            opacity: isOpen ? 1 : 0,
            transitionDelay: isOpen ? '150ms' : '0ms'
          }}
        >
          {answer}
        </div>
      </div>
      <div className="h-px bg-[#0d3528]/10 w-full mt-4 transition-all duration-300 transform origin-left" style={{ transform: `scaleX(${isOpen ? 1 : 0.7})` }}></div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    {
      question: "so what's the vibe with void IDE?",
      answer: "void IDE is a small passion project by Abdullah that keeps it lightweight but powerful. it cuts through the noise with a clean UI while still giving you all the coding superpowers you actually need. it is a browser-based IDE that you wish existed."
    },
    {
      question: "how's this helpful for beginners tho?",
      answer: "the clean interface doesn't overwhelm you with a million buttons and menus. it gradually introduces advanced features as you need them, with helpful suggestions that actually make sense when you're just starting out. plus, the code visualization tool helps you understand your program flow, and the notes feature lets you track your learning progress without switching between apps."
    },
    
    {
      question: "how does the code visualization work?",
      answer: "when writing JavaScript or TypeScript, you can click the Visualize button to generate a flowchart of your code. it automatically shows relationships between functions and variables, making your code structure easy to understand. perfect for learning, planning, or explaining your code to others."
    },
    {
      question: "can it handle my coding assignments and projects?",
      answer: "absolutely! void IDE works smoothly whether you're building a small class project or a more complex app. it won't lag or crash when your project grows, and the smart code suggestions actually understand what you're trying to build. the built-in notes feature lets you document your progress and save important code snippets as you work."
    },
    {
      question: "what makes it better than using whatever free editor?",
      answer: "the real-time error checking saves you from the frustration of finding bugs later. plus, the intelligent autocompletion understands your code context, not just random suggestions. it's like having a coding buddy who actually gets what you're trying to do."
    },
    
    {
      question: "is void IDE open for contributions?",
      answer: (
        <>
          for sure! this project was created with community growth in mind. you can contribute through GitHub — just click {' '}
          <a 
            href="https://github.com/abduwu8" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-[#0d3528] font-medium hover:text-[#174f3f] transition-all"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            abduwu8
          </a>. if you've got ideas or want to collaborate, hit me up. whether it's UI tweaks, performance boosts, or new features — your input is welcome. let's build something awesome together.
        </>
      )
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="min-h-screen w-full py-20 relative overflow-hidden">
      {/* Add abstract shapes */}
      <AbstractShapes theme="light" />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-2xl mx-auto">
          <h2 
            className="text-4xl text-[#0d3528] mb-16 text-center project-blackbird-font relative"
          >
            <span className="relative inline-block font-bold project-blackbird-font">what's this?</span>
          </h2>
          
          <div className="bg-transparent">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                index={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                toggleAccordion={() => toggleAccordion(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ; 
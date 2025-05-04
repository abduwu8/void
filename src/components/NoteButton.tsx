import { useState } from 'react'
import NoteModal from './NoteModal'

interface NoteButtonProps {
  codeEditorContent?: string;
}

const NoteButton = ({ codeEditorContent }: NoteButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className={`fixed right-6 bottom-6 bg-[#0d3528] text-white rounded-full p-3 shadow-lg hover:bg-[#0d3528]/90 transition-colors z-40 flex items-center justify-center ${isModalOpen ? 'bg-[#0d3528]/80' : ''}`}
        aria-label={isModalOpen ? "Close notes" : "Open notes"}
        title={isModalOpen ? "Close notes" : "Open notes"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      
      <NoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        codeEditorContent={codeEditorContent}
      />
    </>
  );
};

export default NoteButton; 
import { useState, useEffect, useRef } from 'react'

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: number;
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  codeEditorContent?: string;
}

const NoteModal = ({ isOpen, onClose}: NoteModalProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // State for handling the draggable functionality
  const [position, setPosition] = useState({ x: -1, y: -1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Refs for the modal and the drag handle
  const modalRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('voidIdeNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      // Add a sample note for first-time users
      const sampleNote: Note = {
        id: 'sample-note',
        title: 'welcome to notes',
        content: 'jot down thoughts while you code.\n\n• create multiple notes\n• edit anytime\n• export as .txt\n• automatically saved\n• drag title bar to move',
        timestamp: Date.now()
      };
      setNotes([sampleNote]);
    }
    
    // Initialize position if not set
    if (position.x === -1 && position.y === -1) {
      // Default position (right side of the screen)
      const defaultX = window.innerWidth - 320; // Default width of modal is 320px (w-80)
      const defaultY = 96; // 24px from the top (top-24)
      setPosition({ x: defaultX, y: defaultY });
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voidIdeNotes', JSON.stringify(notes));
  }, [notes]);
  
  // Setup drag event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Make sure modal stays within viewport
        const modalWidth = modalRef.current?.offsetWidth || 320;
        
        const maxX = window.innerWidth - modalWidth;
        const maxY = window.innerHeight - 50; // Allow a bit to be off-screen at bottom
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current && handleRef.current) {
      // Only initiate drag when clicking on the handle (title bar)
      setIsDragging(true);
      
      const modalRect = modalRef.current.getBoundingClientRect();
      const offsetX = e.clientX - modalRect.left;
      const offsetY = e.clientY - modalRect.top;
      
      setDragOffset({ x: offsetX, y: offsetY });
    }
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'untitled',
      content: '',
      timestamp: Date.now()
    };
    
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
    setCurrentTitle(newNote.title);
    setCurrentContent(newNote.content);
    setIsEditing(true);
  };

  const selectNote = (id: string) => {
    const selected = notes.find(note => note.id === id);
    if (selected) {
      setActiveNote(id);
      setCurrentTitle(selected.title);
      setCurrentContent(selected.content);
      setIsEditing(false);
    }
  };

  const updateNote = () => {
    if (!activeNote) return;
    
    setNotes(notes.map(note => 
      note.id === activeNote 
        ? { 
            ...note, 
            title: currentTitle, 
            content: currentContent, 
            timestamp: Date.now() 
          } 
        : note
    ));
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (activeNote === id) {
      setActiveNote(null);
      setCurrentTitle('');
      setCurrentContent('');
    }
  };

  const exportNote = () => {
    if (!activeNote) return;
    
    const noteToExport = notes.find(note => note.id === activeNote);
    if (!noteToExport) return;

    let content = `${noteToExport.title}\n${'='.repeat(noteToExport.title.length)}\n\n${noteToExport.content}\n\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = `${noteToExport.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.href = URL.createObjectURL(blob);
    a.click();
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      ref={modalRef}
      className={`fixed z-50 flex flex-col shadow-xl w-80 bg-[#f8f5ed] rounded-xl border border-[#0d3528]/10 overflow-hidden transition-opacity duration-200 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Draggable Title Bar */}
      <div 
        ref={handleRef}
        className="flex items-center justify-between p-2 border-b border-[#0d3528]/10 cursor-move bg-[#0d3528]/5"
        onMouseDown={handleMouseDown}
      >
        <h3 className="text-sm text-[#0d3528] font-medium project-blackbird-font select-none">notes</h3>
        <button 
          onClick={onClose}
          className="text-[#0d3528]/60 hover:text-[#0d3528] transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 max-h-[500px]">
        {/* Sidebar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={createNewNote}
              className="text-xs text-[#0d3528] px-3 py-1 rounded-md bg-[#0d3528]/10 hover:bg-[#0d3528]/15 transition-colors project-blackbird-font w-full"
            >
              + new note
            </button>
          </div>
          
          <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
            {notes.length === 0 ? (
              <p className="text-xs text-[#0d3528]/50 text-center py-2 project-blackbird-font">
                no notes yet
              </p>
            ) : (
              notes.map(note => (
                <div 
                  key={note.id} 
                  className={`p-2 rounded-md cursor-pointer flex justify-between items-start group transition-all ${
                    activeNote === note.id ? 'bg-[#0d3528]/10' : 'hover:bg-[#0d3528]/5'
                  }`}
                  onClick={() => selectNote(note.id)}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs text-[#0d3528] truncate project-blackbird-font">{note.title}</h4>
                    <p className="text-xs text-[#0d3528]/50 truncate project-blackbird-font">
                      {formatDate(note.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-[#0d3528]/30 hover:text-[#0d3528]/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete note"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Note Editor */}
        {activeNote ? (
          <div className="border-t border-[#0d3528]/10 pt-2">
            <div className="flex justify-between items-center mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="text-sm text-[#0d3528] bg-transparent border-b border-[#0d3528]/20 focus:border-[#0d3528]/50 outline-none px-1 py-1 w-full project-blackbird-font"
                  placeholder="note title"
                />
              ) : (
                <h3 className="text-sm text-[#0d3528] project-blackbird-font">{currentTitle}</h3>
              )}
              
              <div className="flex items-center space-x-1">
                {isEditing ? (
                  <button
                    onClick={updateNote}
                    className="text-xs text-white px-2 py-1 rounded-md bg-[#0d3528] hover:bg-[#0d3528]/90 transition-colors project-blackbird-font"
                  >
                    save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-[#0d3528] px-2 py-1 rounded-md bg-[#0d3528]/10 hover:bg-[#0d3528]/15 transition-colors project-blackbird-font"
                    >
                      edit
                    </button>
                    <button
                      onClick={exportNote}
                      className="text-xs text-[#0d3528] px-2 py-1 rounded-md bg-[#0d3528]/10 hover:bg-[#0d3528]/15 transition-colors project-blackbird-font"
                      title="Export as .txt file"
                    >
                      export
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <textarea
                value={currentContent}
                onChange={(e) => setCurrentContent(e.target.value)}
                className="w-full h-40 bg-white border border-[#0d3528]/10 rounded-md p-2 focus:outline-none focus:border-[#0d3528]/30 text-xs text-[#0d3528]/80 font-mono custom-scrollbar resize-none"
                placeholder="start typing your note..."
              />
            ) : (
              <div className="bg-white border border-[#0d3528]/10 rounded-md p-2 h-40 overflow-y-auto custom-scrollbar">
                <div className="whitespace-pre-wrap text-xs text-[#0d3528]/80 font-mono">
                  {currentContent || 
                    <span className="text-[#0d3528]/40 italic">
                      no content yet. click edit to start writing.
                    </span>
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-40 border-t border-[#0d3528]/10 pt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0d3528]/20 mb-2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            <p className="text-xs text-[#0d3528]/60 mb-2 project-blackbird-font">select or create a note</p>
            <button 
              onClick={createNewNote}
              className="text-xs text-[#0d3528] px-3 py-1 rounded-md bg-[#0d3528]/10 hover:bg-[#0d3528]/15 transition-colors project-blackbird-font"
            >
              + create note
            </button>
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-[#0d3528]/10 text-center">
        <p className="text-xs text-[#0d3528]/50 project-blackbird-font">
          notes auto-saved locally
        </p>
      </div>
    </div>
  );
};

export default NoteModal; 
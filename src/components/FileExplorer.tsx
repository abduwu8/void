import React, { useState } from 'react';

interface File {
  id: string;
  name: string;
  type: 'file';
  language: string;
  content: string;
}

interface Folder {
  id: string;
  name: string;
  type: 'folder';
  children: (File | Folder)[];
  isOpen: boolean;
}

type FileSystemItem = File | Folder;

interface FileExplorerProps {
  onFileSelect: (file: File) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  // Sample file structure
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          isOpen: false,
          children: [
            {
              id: 'navbar',
              name: 'Navbar.tsx',
              type: 'file',
              language: 'typescript',
              content: '// Navbar component code'
            },
            {
              id: 'fileexplorer',
              name: 'FileExplorer.tsx',
              type: 'file',
              language: 'typescript',
              content: '// FileExplorer component code'
            }
          ]
        },
        {
          id: 'pages',
          name: 'pages',
          type: 'folder',
          isOpen: false,
          children: [
            {
              id: 'homepage',
              name: 'HomePage.tsx',
              type: 'file',
              language: 'typescript',
              content: '// HomePage component code'
            },
            {
              id: 'getstarted',
              name: 'GetStarted.tsx',
              type: 'file',
              language: 'typescript',
              content: '// GetStarted component code'
            }
          ]
        },
        {
          id: 'app',
          name: 'App.tsx',
          type: 'file',
          language: 'typescript',
          content: '// App component code'
        },
        {
          id: 'main',
          name: 'main.tsx',
          type: 'file',
          language: 'typescript',
          content: '// Main entry file'
        }
      ]
    },
    {
      id: 'public',
      name: 'public',
      type: 'folder',
      isOpen: false,
      children: [
        {
          id: 'index',
          name: 'index.html',
          type: 'file',
          language: 'html',
          content: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>void IDE</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>'
        }
      ]
    },
    {
      id: 'package',
      name: 'package.json',
      type: 'file',
      language: 'json',
      content: '{\n  "name": "void-ide",\n  "version": "1.0.0"\n}'
    },
    {
      id: 'readme',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: '# void IDE\n\nA minimal web-based IDE'
    }
  ]);

  // Toggle folder open/closed
  const toggleFolder = (folderId: string) => {
    setFileSystem(prevFileSystem => {
      const updateFolder = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map(item => {
          if (item.type === 'folder') {
            if (item.id === folderId) {
              return { ...item, isOpen: !item.isOpen };
            } else if (item.children) {
              return { ...item, children: updateFolder(item.children) };
            }
          }
          return item;
        });
      };
      
      return updateFolder(prevFileSystem);
    });
  };

  // Render file or folder
  const renderItem = (item: FileSystemItem, level = 0) => {
    const indent = `${level * 16}px`;
    
    if (item.type === 'folder') {
      return (
        <div key={item.id}>
          <div 
            className="flex items-center py-1 px-3 hover:bg-[#0d3528]/10 cursor-pointer"
            onClick={() => toggleFolder(item.id)}
            style={{ paddingLeft: indent }}
          >
            <span className="mr-1">{item.isOpen ? '📂' : '📁'}</span>
            <span className="text-[#0d3528] text-sm project-blackbird-font">{item.name}</span>
          </div>
          
          {item.isOpen && (
            <div>
              {item.children.map(child => renderItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    } else {
      // Get file icon based on extension
      const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        
        switch(extension) {
          case 'js':
            return '📄 ';
          case 'jsx':
          case 'ts':
          case 'tsx':
            return '📄 ';
          case 'py':
            return '🐍 ';
          default:
            return '📄 ';
        }
      };
      
      return (
        <div 
          key={item.id}
          className="flex items-center py-1 px-3 hover:bg-[#0d3528]/10 cursor-pointer"
          onClick={() => onFileSelect(item)}
          style={{ paddingLeft: indent }}
        >
          <span className="mr-1">{getFileIcon(item.name)}</span>
          <span className="text-[#0d3528] text-sm project-blackbird-font">{item.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#f8f5ed] border-r border-[#0d3528]/20 h-full overflow-y-auto">
      <div className="p-2 border-b border-[#0d3528]/20">
        <h3 className="text-sm font-medium project-blackbird-font text-[#0d3528]">Explorer</h3>
      </div>
      <div className="py-2">
        {fileSystem.map(item => renderItem(item))}
      </div>
    </div>
  );
};

export default FileExplorer; 
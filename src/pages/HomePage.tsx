import React from 'react'
import Navbar from '../components/Navbar'
import ShinyText from '../components/ShinyText'
import AbstractShapes from '../components/AbstractShapes'

const HomePage = () => {
  return (
    <div id="home" className="min-h-screen w-full relative overflow-hidden">
      {/* Background styling */}
      <div className="fixed inset-0 -z-10" style={{ 
        background: '#f8f5ed',  // Off-white background color
        overflow: 'hidden'
      }}/>
      
      {/* Add abstract shapes */}
      <AbstractShapes theme="light" />
      
      <Navbar />
      
      <div className="container mx-auto px-4 flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-start">
          <h1 className="text-9xl md:text-9xl text-green-800 project-blackbird-font">
            void <br/> ide.
          </h1>
          
          <div className="mt-3">
            <ShinyText 
              speed={4} 
              className="project-blackbird-font text-sm"
            >
              an ide built by{' '}
              <a 
                href="https://www.linkedin.com/in/abdullahkhannn" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#0d3528] hover:underline transition-colors project-blackbird-font"
              >
                abdullah
              </a>
            </ShinyText>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

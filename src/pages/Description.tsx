
import ScrollReveal from '../components/ScrollReveal'
import Navbar from '../components/Navbar'

const Description = () => {
  return (
    <div id="about" className="min-h-screen w-full relative overflow-hidden">
      {/* Background styling */}
      <div className="fixed inset-0 -z-10" style={{ 
        background: '#f8f5ed',  // Off-white background color
        overflow: 'hidden'
      }}/>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-32 max-w-6xl">
        <div className="w-full mx-auto">
          {/* Console header */}
          <div className="bg-[#0d3528] text-white rounded-t-md p-2 flex items-center">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm project-blackbird-font tracking-wide">void_ide ~ terminal</div>
          </div>
          
          {/* Console body */}
          <div className="border-2 border-[#0d3528] rounded-b-md p-8 lg:p-12 bg-[#f8f5ed]/80 backdrop-blur-sm">
            <div className="mb-12">
              
            </div>
            
            <div className="space-y-60 ml-4 border-l-2 border-dashed border-[#0d3528]/20 pl-6 md:pl-10">
              {/* Terminal line prefix */}
              <div>
                <div className="text-[#0d3528]/50 project-blackbird-font text-xs mb-2">$ info --description</div>
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={3}
                  blurStrength={8}
                  textClassName="text-[#0d3528] project-blackbird-font"
                  containerClassName="w-full"
                >
                  void IDE is your no-install, zero-drama coding playground built by abdullah — TypeScript, JavaScript, and Python all chillin' in one browser tab. It's like VS Code's cool, minimalist cousin that doesn't judge your semicolons.
                </ScrollReveal>
              </div>
              
              <div>
                <div className="text-[#0d3528]/50 project-blackbird-font text-xs mb-2">$ info --mission</div>
                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={4}
                  blurStrength={6}
                  textClassName="text-[#0d3528] project-blackbird-font"
                  containerClassName="w-full"
                >
                  abdullah got bored and built Void IDE — a side project turned dev playground where writing code doesn't feel like a chore.
                </ScrollReveal>
              </div>
              
              
            </div>
            
            {/* Console footer */}
            <div className="mt-32 pt-4 border-t border-[#0d3528]/20">
              <span className="text-[#0d3528]/70 project-blackbird-font text-sm block">$ exit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Description

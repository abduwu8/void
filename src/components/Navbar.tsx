import { useState, useEffect } from 'react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past threshold
      const isScrolled = currentScrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
      
      // Determine scroll direction and hide/show navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide navbar
        setHidden(true);
      } else {
        // Scrolling up or at top - show navbar
        setHidden(false);
      }
      
      // Update last scroll position
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled, lastScrollY]);

  // Handle smooth scrolling
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 transform ${
      hidden 
        ? '-translate-y-full' 
        : 'translate-y-0'
    } ${
      scrolled 
        ? 'bg-transparent' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto flex items-center justify-center pt-8">
        {/* Circular border container */}
        <div className={`flex items-center justify-center px-12 py-4 rounded-full transition-all duration-300 ${
          scrolled 
            ? 'bg-[#f8f5ed]/90 backdrop-blur-md border border-[#0d3528]/30 shadow-sm' 
            : 'bg-[#f8f5ed]/70 border border-[#0d3528]/20'
        }`}>
          {/* Logo and Nav links */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <div className="text-[#0d3528] text-xl font-bold project-blackbird-font" >void</div>

            {/* Nav Links */}
            <div className="flex items-center space-x-10">
              <a 
                href="#home" 
                onClick={(e) => scrollToSection(e, 'home')}
                className="text-[#0d3528] hover:text-[#174f3f] text-sm font-medium transition-colors project-blackbird-font" 
              >
                home
              </a>
              <a 
                href="#get-started" 
                onClick={(e) => scrollToSection(e, 'get-started')}
                className="text-[#0d3528]/70 hover:text-[#0d3528] text-sm font-medium transition-colors project-blackbird-font"
              >
                get started
              </a>
              <a 
                href="#about" 
                onClick={(e) => scrollToSection(e, 'about')}
                className="text-[#0d3528]/70 hover:text-[#0d3528] text-sm font-medium transition-colors project-blackbird-font"
              >
                about
              </a>
              <a 
                href="#faq" 
                onClick={(e) => scrollToSection(e, 'faq')}
                className="text-[#0d3528]/70 hover:text-[#0d3528] text-sm font-medium transition-colors project-blackbird-font"
              >
                what's this?
              </a>
              {/* <a 
                href="#" 
                className="text-[#0d3528]/70 hover:text-[#0d3528] text-sm font-medium transition-colors project-blackbird-font"
              >
                contact
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

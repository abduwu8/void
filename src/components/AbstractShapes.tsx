import React from 'react';

interface AbstractShapesProps {
  theme?: 'light' | 'dark';
}

const AbstractShapes: React.FC<AbstractShapesProps> = ({ theme = 'light' }) => {
  // Colors based on theme
  const colors = {
    primary: theme === 'light' ? '#0d3528' : '#2a9d8f',
    secondary: theme === 'light' ? '#2a9d8f' : '#0d3528',
    accent: theme === 'light' ? '#bc6c25' : '#e76f51'
  };

  return (
    <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
      {/* Large wavy line bottom */}
      <svg 
        className="absolute"
        style={{ bottom: '15%', left: '0', right: '0', opacity: 0.07, width: '100%' }}
        height="100" 
        preserveAspectRatio="none"
        viewBox="0 0 1200 100"
      >
        <path 
          d="M0 50C100 20 200 80 300 50C400 20 500 80 600 50C700 20 800 80 900 50C1000 20 1100 80 1200 50" 
          stroke={colors.primary}
          strokeWidth="3"
          fill="none"
        />
      </svg>
      
      {/* Medium wavy line top */}
      <svg 
        className="absolute"
        style={{ top: '10%', left: '0', right: '0', opacity: 0.05, width: '100%' }}
        height="80" 
        preserveAspectRatio="none"
        viewBox="0 0 1200 80"
      >
        <path 
          d="M0 40C100 10 200 70 300 40C400 10 500 70 600 40C700 10 800 70 900 40C1000 10 1100 70 1200 40" 
          stroke={colors.secondary}
          strokeWidth="2"
          fill="none"
        />
        <path 
          d="M0 60C100 30 200 90 300 60C400 30 500 90 600 60C700 30 800 90 900 60C1000 30 1100 90 1200 60" 
          stroke={colors.secondary}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="5,8"
        />
      </svg>
      
      {/* Small wavy line middle */}
      <svg 
        className="absolute"
        style={{ top: '40%', left: '0', right: '0', opacity: 0.03, width: '100%' }}
        height="60" 
        preserveAspectRatio="none"
        viewBox="0 0 1200 60"
      >
        <path 
          d="M0 30C75 15 150 45 225 30C300 15 375 45 450 30C525 15 600 45 675 30C750 15 825 45 900 30C975 15 1050 45 1125 30C1200 15 1275 45 1350 30" 
          stroke={colors.primary}
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
      
      {/* Accent wavy line at 70% */}
      <svg 
        className="absolute"
        style={{ top: '70%', left: '0', right: '0', opacity: 0.04, width: '100%' }}
        height="40" 
        preserveAspectRatio="none"
        viewBox="0 0 1200 40"
      >
        <path 
          d="M0 20C50 10 100 30 150 20C200 10 250 30 300 20C350 10 400 30 450 20C500 10 550 30 600 20C650 10 700 30 750 20C800 10 850 30 900 20C950 10 1000 30 1050 20C1100 10 1150 30 1200 20" 
          stroke={colors.accent}
          strokeWidth="1"
          fill="none"
        />
      </svg>
      
      {/* Subtle wavy line at 25% */}
      <svg 
        className="absolute"
        style={{ top: '25%', left: '0', right: '0', opacity: 0.02, width: '100%' }}
        height="30" 
        preserveAspectRatio="none"
        viewBox="0 0 1200 30"
      >
        <path 
          d="M0 15C150 5 300 25 450 15C600 5 750 25 900 15C1050 5 1200 25 1350 15" 
          stroke={colors.primary}
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default AbstractShapes; 
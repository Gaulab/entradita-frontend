import React, { useState, useRef, useEffect } from 'react';

export function Tooltip({ children, content }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        hideTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative inline-block" ref={triggerRef}>
        <div
          className="text-gray-400 cursor-help"
          onClick={isVisible ? hideTooltip : showTooltip}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
        >
          {children}
        </div>
      </div>
      {isVisible && (
        <div 
          ref={tooltipRef}
          className="fixed top-0 left-0 right-0 z-50 p-4 bg-gray-900 text-white text-sm md:absolute md:top-auto md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 md:translate-y-full md:bg-gray-900 md:rounded-lg md:shadow-lg md:p-2 md:w-max md:max-w-xs"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {content}
          <div className="hidden md:block absolute left-1/2 bottom-full -translate-x-1/2 translate-y-1 border-8 border-transparent border-b-gray-900"></div>
        </div>
      )}
    </>
  );
}

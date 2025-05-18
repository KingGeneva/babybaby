
import React, { useRef, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

interface AutoScrollProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export const AutoScroll: React.FC<AutoScrollProps> = ({
  children,
  speed = 1,
  direction = 'left',
  className = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const contentWidth = useRef(0);
  const containerWidth = useRef(0);
  const wrappedContent = useRef<HTMLDivElement>(null);
  
  // Detect if content is duplicated to prevent unnecessary re-renders
  const isDuplicated = useRef(false);

  useEffect(() => {
    if (!contentRef.current || !wrappedContent.current) return;

    const calculateWidths = () => {
      if (!contentRef.current) return;
      contentWidth.current = contentRef.current.scrollWidth;
      containerWidth.current = contentRef.current.offsetWidth;
      
      // Duplicate content for seamless scrolling if not already duplicated
      if (!isDuplicated.current && contentWidth.current > 0) {
        if (wrappedContent.current) {
          const clone = wrappedContent.current.cloneNode(true) as HTMLElement;
          contentRef.current.appendChild(clone);
          isDuplicated.current = true;
        }
      }
    };

    calculateWidths();
    
    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      calculateWidths();
    });
    
    resizeObserver.observe(contentRef.current);
    
    return () => {
      if (contentRef.current) {
        resizeObserver.unobserve(contentRef.current);
      }
    };
  }, [children]);

  useAnimationFrame(() => {
    if (contentWidth.current === 0) return;
    
    const moveSpeed = direction === 'left' ? -speed : speed;
    let newX = scrollX.get() + moveSpeed;

    // Reset position once a full scroll cycle is complete
    if (Math.abs(newX) >= contentWidth.current / 2) {
      newX = 0;
    }
    
    scrollX.set(newX);
  });

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div 
        ref={contentRef}
        style={{ x: scrollX }}
        className="flex"
      >
        <div ref={wrappedContent} className="flex">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

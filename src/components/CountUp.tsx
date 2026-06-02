import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number; // duration in seconds
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function CountUp({
  to,
  from = 0,
  duration = 1.6,
  suffix = '',
  prefix = '',
  decimals = 0
}: CountUpProps) {
  const [count, setCount] = useState(from);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // triggers slightly before entering fully
      }
    );

    const currentRef = elementRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) {
      setCount(from);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = (timestamp - startTime) / 1000; // in seconds
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Quartic ease-out function for a super smooth deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = from + easeProgress * (to - from);
      
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCount(to); // Ensure precise ending value
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasAnimated, to, from, duration]);

  // Format with correct decimal points if configured
  const formattedCount = count.toFixed(decimals);

  return (
    <span ref={elementRef} className="font-extrabold tabular-nums transition-all">
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
}

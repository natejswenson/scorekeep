import { useState, useEffect } from 'react';

/**
 * Custom hook to detect device orientation using window dimensions
 * @returns 'landscape' if width > height, otherwise 'portrait'
 */
export const useOrientation = (): 'landscape' | 'portrait' => {
  const [orientation, setOrientation] = useState<'landscape' | 'portrait'>(() => {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  });

  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return orientation;
};

/**
 * Custom hook to check if device is in landscape mode
 * @returns true if landscape, false if portrait
 */
export const useIsLandscape = (): boolean => {
  const orientation = useOrientation();
  return orientation === 'landscape';
};

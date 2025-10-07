'use client';

import { useState, useEffect } from 'react';
import SplineScene from './SplineScene';

interface LazySplineSceneProps {
  sceneUrl: string;
  className?: string;
}

const LazySplineScene = ({ sceneUrl, className }: LazySplineSceneProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load Spline scene only when component is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('spline-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div id="spline-container" className={className}>
      {shouldLoad ? (
        <SplineScene sceneUrl={sceneUrl} className="w-full h-full" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
          <div className="text-white text-lg font-semibold">Cargando...</div>
        </div>
      )}
    </div>
  );
};

export default LazySplineScene;

'use client';

import React, { Suspense } from 'react';

// Lazy loading según la documentación oficial
const Spline = React.lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  sceneUrl: string;
  className?: string;
}

export default function SplineScene({ sceneUrl, className = '' }: SplineSceneProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Cargando Escena 3D</h3>
            <p className="text-gray-300">Spline 3D Scene</p>
          </div>
        </div>
      }>
        <div 
          className="w-full h-full relative"
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            touchAction: 'none'
          }}
        >
          <Spline
            scene={sceneUrl}
            style={{ 
              width: '100%', 
              height: '100%',
              pointerEvents: 'none',
              userSelect: 'none',
              touchAction: 'none',
              background: 'transparent'
            }}
          />
        </div>
      </Suspense>
      
      {/* Enhanced overlay for better integration */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
}

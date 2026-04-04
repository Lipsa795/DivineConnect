import React, { useEffect, useRef, useState } from 'react';

function SketchfabViewer({ modelId, title }) {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState(null);

  useEffect(() => {
    // Load Sketchfab viewer script
    const script = document.createElement('script');
    script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initViewer();
    };

    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [modelId]);

  const initViewer = () => {
    if (!iframeRef.current) return;

    const client = new window.Sketchfab(iframeRef.current);
    
    client.init(modelId, {
      success: (api) => {
        setApi(api);
        api.start();
        api.addEventListener('viewerready', () => {
          setIsLoading(false);
          console.log('Viewer is ready');
          
          // Optional: Set initial camera position
          api.getCameraLookAt((err, camera) => {
            if (!err) {
              console.log('Camera position:', camera);
            }
          });
        });
      },
      error: () => {
        console.error('Failed to load model');
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-900 rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-white">Loading 3D Temple Model...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src=""
        className="w-full h-full min-h-[500px]"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        title={title || "3D Temple Model"}
      />
      
      {/* Controls Hint */}
      <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-3 py-2 rounded-full z-10">
        <i className="fas fa-mouse-pointer mr-1"></i> Drag to rotate | Right-click to pan | Scroll to zoom
      </div>
    </div>
  );
}

export default SketchfabViewer;
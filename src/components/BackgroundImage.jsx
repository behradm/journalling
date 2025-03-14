import { useState, useEffect } from 'react';
import { generateImage } from '../services/openai';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop';

function BackgroundImage({ children }) {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateBackgroundImage = async () => {
      setIsLoading(true);
      try {
        const prompt = "Generate an ultra-minimalist, sublime landscape that stuns with its simplicity and depth. The scene could be a vast sea reduced to a single, smooth gradient of soft blue meeting a faint horizon line; or a lone mountain peak, a sharp silhouette against a muted pastel sky; or a desert with one unbroken dune edge in warm gold fading into nothing; or a forest distilled to a single tree outlined in shadow against a hazy void. Use only 2-3 colors—subtle, tranquil tones like pale blues, lavenders, or golds—with clean, unbroken lines and expansive negative space. The horizon should pull the eye effortlessly into the distance, blending into a minimalist sky of one faint hue. The result should feel serene, infinite, and breathtaking, delivering a powerful 'WOW' through extreme simplicity.";
        
        // Generate a new image each time the app is loaded
        // We're not caching the image anymore as requested
        const imageUrl = await generateImage(prompt);
        
        if (imageUrl) {
          setBackgroundImage(imageUrl);
        } else {
          // Use default image if generation fails
          setBackgroundImage(DEFAULT_IMAGE);
        }
      } catch (error) {
        console.error('Error generating background image:', error);
        setBackgroundImage(DEFAULT_IMAGE);
      } finally {
        setIsLoading(false);
      }
    };

    generateBackgroundImage();
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      {/* Background image with overlay */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ 
          backgroundImage: `url(${backgroundImage || DEFAULT_IMAGE})`,
          opacity: isLoading ? 0 : 1
        }}
      >
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-indigo-500 mx-auto"></div>
            <p className="text-xl text-white">Generating your unique background...</p>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export default BackgroundImage;

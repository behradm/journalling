import { useState, useEffect } from 'react'
import { getRandomMinimalistImage, getMultipleMinimalistImages } from './services/unsplash'

// Initial fallback images in case we don't have any cached images yet
const FALLBACK_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2517&auto=format&fit=crop'
];

function App() {
  const [backgroundImage, setBackgroundImage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Function to clear cache and force refresh
  const clearCacheAndRefresh = () => {
    try {
      localStorage.removeItem('backgroundImageData');
      console.log('Cache cleared');
      window.location.reload();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  useEffect(() => {
    const generateAndManageBackgrounds = async () => {
      setIsLoading(true)
      
      try {
        // Force clear cache if URL parameter is present
        try {
          if (window.location.search.includes('forceClear=true')) {
            localStorage.removeItem('backgroundImageData');
            console.log('Cache forcefully cleared by URL parameter');
            
            // Remove the parameter from URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
          }
        } catch (error) {
          console.error('Error handling URL parameters:', error);
        }
        
        // Get cached data from localStorage
        let imageData = { images: [], usageCount: 0, totalLoads: 0 };
        
        try {
          const cachedData = localStorage.getItem('backgroundImageData');
          if (cachedData) {
            imageData = JSON.parse(cachedData);
          }
        } catch (error) {
          console.error('Error parsing cached data:', error);
        }
        
        // Increment total loads counter
        imageData.totalLoads += 1;
        
        // Determine if we need to generate new images
        const shouldGenerateNew = 
          imageData.images.length < 3 || 
          (imageData.images.length === 3 && imageData.totalLoads % 5 === 0) ||
          (imageData.images.length >= 4 && imageData.totalLoads % 5 === 0);
        
        if (shouldGenerateNew || imageData.images.length === 0) {
          console.log('Fetching new background images from Unsplash...');
          
          // If we have no images yet, fetch 3 at once to initialize our collection
          if (imageData.images.length === 0) {
            const imageUrls = await getMultipleMinimalistImages(3);
            if (imageUrls && imageUrls.length > 0) {
              imageData.images = imageUrls;
              console.log('Initial set of images fetched from Unsplash');
            }
          } else {
            // Otherwise just fetch one new image
            const imageUrl = await getRandomMinimalistImage();
            if (imageUrl) {
              // Add new image to the collection
              imageData.images.push(imageUrl);
              console.log('New image fetched from Unsplash and added to cache');
            }
          }
        }
        
        // Select a random image from our collection
        let selectedImage;
        
        if (imageData.images.length > 0) {
          // Use cached images if available
          selectedImage = imageData.images[Math.floor(Math.random() * imageData.images.length)];
        } else {
          // Fall back to our default images if no cached images yet
          selectedImage = FALLBACK_BACKGROUNDS[Math.floor(Math.random() * FALLBACK_BACKGROUNDS.length)];
        }
        
        // Update the background
        setBackgroundImage(selectedImage);
        
        // Save updated data back to localStorage
        try {
          localStorage.setItem('backgroundImageData', JSON.stringify(imageData));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
      } catch (error) {
        console.error('Error managing background images:', error);
        // Use a fallback image if there's an error
        const fallbackImage = FALLBACK_BACKGROUNDS[Math.floor(Math.random() * FALLBACK_BACKGROUNDS.length)];
        setBackgroundImage(fallbackImage);
        console.log('Using fallback image due to error:', fallbackImage);
      } finally {
        // Short timeout to ensure the loading animation is visible
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    generateAndManageBackgrounds();
  }, []);

  // Styles for the background image
  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    transition: 'opacity 1s ease-in-out'
  } : null;

  // Style for the overlay to ensure text readability if needed
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: -1
  };

  // Style for the refresh button
  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 15px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    zIndex: 10
  };

  return (
    <div className="app-container">
      {/* Background Image */}
      {backgroundImage && <div style={backgroundStyle} data-testid="background-image"></div>}
      
      {/* Subtle overlay */}
      <div style={overlayStyle}></div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-t-4 border-white border-t-indigo-500 rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-white text-xl">Loading your unique background...</p>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button 
        style={buttonStyle}
        onClick={clearCacheAndRefresh}
        data-testid="clear-cache-button"
      >
        Clear Cache & Refresh
      </button>
    </div>
  );
}

export default App

import { useState, useEffect } from 'react'
import { generateImage } from './services/openai'

// Initial fallback images in case we don't have any cached images yet
const FALLBACK_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2517&auto=format&fit=crop'
];

function App() {
  const [backgroundImage, setBackgroundImage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateAndManageBackgrounds = async () => {
      setIsLoading(true)
      
      try {
        // Get cached data from localStorage
        const cachedData = localStorage.getItem('backgroundImageData')
        let imageData = cachedData ? JSON.parse(cachedData) : {
          images: [],
          usageCount: 0,
          totalLoads: 0
        }
        
        // Increment total loads counter
        imageData.totalLoads += 1
        
        // Determine if we need to generate a new image
        const shouldGenerateNew = 
          // Generate new if we have fewer than 3 images
          imageData.images.length < 3 || 
          // Generate new every 100 loads initially (when we have 3 images)
          (imageData.images.length === 3 && imageData.totalLoads % 100 === 0) ||
          // Generate new every 5 loads after we have 4+ images
          (imageData.images.length >= 4 && imageData.totalLoads % 5 === 0)
        
        if (shouldGenerateNew) {
          console.log('Generating new background image...')
          const prompt = "Generate an ultra-minimalist, sublime landscape that stuns with its simplicity and depth. The scene could be a vast sea reduced to a single, smooth gradient of soft blue meeting a faint horizon line; or a lone mountain peak, a sharp silhouette against a muted pastel sky; or a desert with one unbroken dune edge in warm gold fading into nothing; or a forest distilled to a single tree outlined in shadow against a hazy void. Use only 2-3 colors—subtle, tranquil tones like pale blues, lavenders, or golds—with clean, unbroken lines and expansive negative space. The horizon should pull the eye effortlessly into the distance, blending into a minimalist sky of one faint hue. The result should feel serene, infinite, and breathtaking, delivering a powerful 'WOW' through extreme simplicity."
          
          const imageUrl = await generateImage(prompt)
          
          if (imageUrl) {
            // Add new image to the collection
            imageData.images.push(imageUrl)
            console.log('New image generated and added to cache')
          }
        }
        
        // Select a random image from our collection
        let selectedImage
        
        if (imageData.images.length > 0) {
          // Use cached images if available
          selectedImage = imageData.images[Math.floor(Math.random() * imageData.images.length)]
        } else {
          // Fall back to our default images if no cached images yet
          selectedImage = FALLBACK_BACKGROUNDS[Math.floor(Math.random() * FALLBACK_BACKGROUNDS.length)]
        }
        
        // Update the background
        setBackgroundImage(selectedImage)
        
        // Save updated data back to localStorage
        localStorage.setItem('backgroundImageData', JSON.stringify(imageData))
        
      } catch (error) {
        console.error('Error managing background images:', error)
        // Use a fallback image if there's an error
        setBackgroundImage(FALLBACK_BACKGROUNDS[Math.floor(Math.random() * FALLBACK_BACKGROUNDS.length)])
      } finally {
        // Short timeout to ensure the loading animation is visible
        setTimeout(() => {
          setIsLoading(false)
        }, 800)
      }
    }

    generateAndManageBackgrounds()
  }, [])

  // Styles for the background image
  const backgroundStyle = {
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
  }

  // Style for the overlay to ensure text readability if needed
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: -1
  }

  return (
    <>
      {/* Background Image */}
      <div style={backgroundStyle}></div>
      
      {/* Subtle overlay */}
      <div style={overlayStyle}></div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-t-4 border-white border-t-indigo-500 rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-white text-xl">Generating your unique background...</p>
          </div>
        </div>
      )}
    </>
  )
}

export default App

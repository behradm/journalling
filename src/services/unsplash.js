/**
 * Unsplash API service for fetching beautiful background images that match specific aesthetic criteria
 */

const UNSPLASH_API_URL = 'https://api.unsplash.com';
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

/**
 * Aesthetic description for the type of minimalist images we want
 * This helps create more targeted search queries
 */
const AESTHETIC_DESCRIPTION = "Ultra-minimalist sublime landscape with simplicity and depth. Using only 2-3 colors—subtle, tranquil tones like pale blues, lavenders, or golds—with clean lines and expansive negative space.";

/**
 * Carefully crafted search terms to find images matching our aesthetic
 */
const SEARCH_TERMS = [
  'minimalist landscape',
  'minimal horizon',
  'abstract landscape',
  'minimal mountains',
  'minimalist seascape',
  'geometric landscape',
  'minimal desert',
  'pastel horizon',
  'minimalist nature',
  'simple gradient landscape',
  'minimalist skyline',
  'zen landscape',
  'minimalist fog',
  'minimalist snow',
  'minimalist beach',
  'minimalist sunset',
  'minimalist dawn',
  'minimalist lake',
  'minimalist ocean',
  'minimalist forest'
];

/**
 * Color filters to ensure we get images with the right color palette
 */
const COLOR_FILTERS = [
  'blue',
  'light_blue',
  'teal',
  'purple',
  'lavender',
  'yellow',
  'orange',
  'beige',
  'white',
  'black',
  'minimal',
  'pastel'
];

/**
 * Fetches a random minimalist landscape image from Unsplash that matches our aesthetic
 * @returns {Promise<string>} URL of the image
 */
export const getRandomMinimalistImage = async () => {
  try {
    console.log('Fetching random minimalist image from Unsplash...');
    
    // Randomly select a search term and color for variety while maintaining aesthetic
    const randomSearchTerm = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
    const randomColor = COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)];
    
    // Build query parameters
    const params = new URLSearchParams({
      query: randomSearchTerm,
      orientation: 'landscape', // Ensure we only get landscape photos
      content_filter: 'high',
      color: randomColor,
      // Add a timestamp to prevent caching
      _: Date.now()
    });
    
    // Add additional parameters to find more minimal, abstract images
    params.append('order_by', 'relevant');
    
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?${params.toString()}`,
      {
        headers: {
          'Authorization': `Client-ID ${ACCESS_KEY}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Double-check that we got a landscape-oriented image
    if (data.width < data.height) {
      console.log('Received portrait image instead of landscape, retrying...');
      return getRandomMinimalistImage(); // Recursively retry if we got a portrait image
    }
    
    console.log('Successfully fetched image from Unsplash:', data.description || data.alt_description);
    
    // Return the full-size image URL (don't modify the URL)
    return data.urls.full;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
};

/**
 * Fetches multiple minimalist landscape images from Unsplash that match our aesthetic
 * @param {number} count - Number of images to fetch
 * @returns {Promise<string[]>} Array of image URLs
 */
export const getMultipleMinimalistImages = async (count = 3) => {
  try {
    console.log(`Fetching ${count} minimalist images from Unsplash...`);
    
    // Randomly select a search term and color for variety while maintaining aesthetic
    const randomSearchTerm = SEARCH_TERMS[Math.floor(Math.random() * SEARCH_TERMS.length)];
    const randomColor = COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)];
    
    // Build query parameters
    const params = new URLSearchParams({
      query: randomSearchTerm,
      orientation: 'landscape', // Ensure we only get landscape photos
      content_filter: 'high',
      color: randomColor,
      count: count,
      // Add a timestamp to prevent caching
      _: Date.now()
    });
    
    // Add additional parameters to find more minimal, abstract images
    params.append('order_by', 'relevant');
    
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?${params.toString()}`,
      {
        headers: {
          'Authorization': `Client-ID ${ACCESS_KEY}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${count} images from Unsplash`);
    
    // Filter out any portrait-oriented images
    const landscapeImages = data.filter(photo => photo.width > photo.height);
    
    // If we don't have enough landscape images, fetch more to compensate
    if (landscapeImages.length < count) {
      console.log(`Only got ${landscapeImages.length} landscape images, fetching more...`);
      const additionalImages = await getMultipleMinimalistImages(count - landscapeImages.length);
      return [...landscapeImages.map(photo => photo.urls.full), ...additionalImages];
    }
    
    // Return an array of full-size image URLs (don't modify the URLs)
    return landscapeImages.map(photo => photo.urls.full);
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
};

/**
 * Unsplash API service for fetching beautiful background images
 */

const UNSPLASH_API_URL = 'https://api.unsplash.com';
const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

/**
 * Fetches a random minimalist landscape image from Unsplash
 * @returns {Promise<string>} URL of the image
 */
export const getRandomMinimalistImage = async () => {
  try {
    console.log('Fetching random minimalist image from Unsplash...');
    
    // Query parameters for minimalist landscapes
    const query = 'minimalist landscape';
    const orientation = 'landscape';
    const contentFilter = 'high';
    
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?query=${query}&orientation=${orientation}&content_filter=${contentFilter}`,
      {
        headers: {
          'Authorization': `Client-ID ${ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched image from Unsplash');
    
    // Return the full-size image URL
    return data.urls.full;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
};

/**
 * Fetches multiple minimalist landscape images from Unsplash
 * @param {number} count - Number of images to fetch
 * @returns {Promise<string[]>} Array of image URLs
 */
export const getMultipleMinimalistImages = async (count = 3) => {
  try {
    console.log(`Fetching ${count} minimalist images from Unsplash...`);
    
    // Query parameters for minimalist landscapes
    const query = 'minimalist landscape';
    const orientation = 'landscape';
    const contentFilter = 'high';
    
    const response = await fetch(
      `${UNSPLASH_API_URL}/photos/random?query=${query}&orientation=${orientation}&content_filter=${contentFilter}&count=${count}`,
      {
        headers: {
          'Authorization': `Client-ID ${ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${count} images from Unsplash`);
    
    // Return an array of full-size image URLs
    return data.map(photo => photo.urls.full);
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
};

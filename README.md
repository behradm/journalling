# Minimalist Background Generator

A React application that generates beautiful, minimalist background images using OpenAI's DALL-E API and implements an efficient caching strategy to minimize API costs.

## Features

- **Dynamic Background Generation**: Uses OpenAI's DALL-E to create stunning minimalist landscapes
- **Smart Caching System**: Implements a sophisticated localStorage-based caching strategy to reduce API costs
- **Distraction-Free UI**: Focuses solely on the beautiful background with no UI elements
- **Responsive Design**: Adapts perfectly to any screen size
- **Fallback System**: Includes high-quality fallback images if API calls fail

## Caching Strategy

The app implements an intelligent caching strategy to balance visual variety with API cost efficiency:

1. Initially generates up to 3 images and stores them in localStorage
2. Uses these 3 images randomly for the first 100 loads to minimize API costs
3. After 100 loads, generates a new image
4. With 4+ images in the cache, generates a new image every 5 loads
5. Always selects images randomly from the cache for a varied experience

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your OpenAI API key:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:

```
VITE_OPENAI_API_KEY=your_api_key_here
```

### Running the app

```bash
npm run dev
```

This will start the development server at http://localhost:5173

## Implementation Details

The app uses:

- Vite for fast development and optimized builds
- React for UI components and state management
- OpenAI API for image generation
- localStorage for persistent caching between sessions

## Security Note

For production applications, it's recommended to handle API calls through a backend service rather than directly from the frontend to protect your API key.

## License

MIT

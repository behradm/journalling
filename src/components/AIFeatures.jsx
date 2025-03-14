import { useState } from 'react';
import { generateText, generateImage } from '../services/openai';

function AIFeatures() {
  const [textPrompt, setTextPrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [textResponse, setTextResponse] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [apiKeyWarning, setApiKeyWarning] = useState(false);

  const handleTextGeneration = async (e) => {
    e.preventDefault();
    if (!textPrompt.trim()) return;

    // Check if API key is set
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your_api_key_here') {
      setApiKeyWarning(true);
      return;
    }

    setIsTextLoading(true);
    setApiKeyWarning(false);
    
    try {
      const response = await generateText(textPrompt);
      setTextResponse(response);
    } catch (error) {
      console.error(error);
      setTextResponse("An error occurred while generating text.");
    } finally {
      setIsTextLoading(false);
    }
  };

  const handleImageGeneration = async (e) => {
    e.preventDefault();
    if (!imagePrompt.trim()) return;

    // Check if API key is set
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your_api_key_here') {
      setApiKeyWarning(true);
      return;
    }

    setIsImageLoading(true);
    setApiKeyWarning(false);
    
    try {
      const imageUrl = await generateImage(imagePrompt);
      setImageUrl(imageUrl || '');
      if (!imageUrl) {
        throw new Error('Failed to generate image');
      }
    } catch (error) {
      console.error(error);
      setImageUrl('');
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Text Generation */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Text Generation</h2>
        
        {apiKeyWarning && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            Please set your OpenAI API key in the .env file first.
          </div>
        )}
        
        <form onSubmit={handleTextGeneration}>
          <div className="mb-4">
            <label htmlFor="textPrompt" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your prompt:
            </label>
            <textarea
              id="textPrompt"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              value={textPrompt}
              onChange={(e) => setTextPrompt(e.target.value)}
              placeholder="Ask me anything..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isTextLoading || !textPrompt.trim()}
            className={`w-full py-2 px-4 rounded-md ${
              isTextLoading || !textPrompt.trim() ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-medium transition-colors`}
          >
            {isTextLoading ? 'Generating...' : 'Generate Text'}
          </button>
        </form>
        
        {textResponse && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Response:</h3>
            <div className="p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
              {textResponse}
            </div>
          </div>
        )}
      </div>
      
      {/* Image Generation */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Image Generation</h2>
        
        {apiKeyWarning && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
            Please set your OpenAI API key in the .env file first.
          </div>
        )}
        
        <form onSubmit={handleImageGeneration}>
          <div className="mb-4">
            <label htmlFor="imagePrompt" className="block text-sm font-medium text-gray-700 mb-1">
              Describe the image you want:
            </label>
            <textarea
              id="imagePrompt"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="A serene beach sunset..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={isImageLoading || !imagePrompt.trim()}
            className={`w-full py-2 px-4 rounded-md ${
              isImageLoading || !imagePrompt.trim() ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-medium transition-colors`}
          >
            {isImageLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </form>
        
        {isImageLoading && (
          <div className="mt-4 flex justify-center items-center h-64 bg-gray-50 rounded-md">
            <div className="animate-pulse text-gray-400">Generating image...</div>
          </div>
        )}
        
        {imageUrl && !isImageLoading && (
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Generated Image:</h3>
            <div className="p-2 bg-gray-50 rounded-md">
              <img 
                src={imageUrl} 
                alt="AI generated" 
                className="w-full h-auto rounded-md"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIFeatures;

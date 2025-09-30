
import React, { useState, useCallback } from 'react';
import { getMarketTrend } from '../services/geminiService';
import type { MarketTrend } from '../types';
import Spinner from './Spinner';

const MarketWatch: React.FC = () => {
  const [cropName, setCropName] = useState<string>('Wheat');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<MarketTrend | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const popularCrops = ['Corn', 'Soybeans', 'Rice', 'Potatoes', 'Tomatoes', 'Cotton'];

  const handleAnalyze = useCallback(async (crop: string) => {
    if (!crop.trim()) {
      setError("Please enter a crop name.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const trend = await getMarketTrend(crop);
      setResult(trend);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleAnalyze(cropName);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-brand-green">Market Watch</h2>
        <p className="text-gray-600 mt-2">Get AI-powered market analysis for your crops, grounded in the latest web search results.</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            placeholder="E.g., Corn, Soybeans..."
            className="flex-grow px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-light-green"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-brand-light-green text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-brand-green transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
          >
            {loading ? <><Spinner/> <span className="ml-2">Analyzing...</span></> : 'Analyze Trends'}
          </button>
        </form>
         <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Try:</span>
            {popularCrops.map(crop => (
                <button key={crop} onClick={() => {setCropName(crop); handleAnalyze(crop);}} className="text-sm bg-gray-200 hover:bg-gray-300 text-brand-brown px-2 py-1 rounded-full transition-colors">
                    {crop}
                </button>
            ))}
        </div>
      </div>
      
      {error && <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert"><p>{error}</p></div>}
      
      {result && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg animate-fade-in">
          <h3 className="text-2xl font-bold text-brand-green mb-4">Market Summary</h3>
          <p className="text-gray-700 leading-relaxed mb-6">{result.summary}</p>

          <h4 className="text-xl font-semibold text-brand-green border-b-2 border-brand-light-green pb-2 mb-4">Sources</h4>
          {result.sources && result.sources.length > 0 ? (
            <ul className="space-y-3">
              {result.sources.map((source, index) => (
                <li key={index}>
                  <a 
                    href={source.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-light-green hover:text-brand-green font-medium hover:underline transition-colors"
                  >
                    {source.web.title || source.web.uri}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No web sources were found for this analysis.</p>
          )}
        </div>
      )}

    </div>
  );
};

export default MarketWatch;

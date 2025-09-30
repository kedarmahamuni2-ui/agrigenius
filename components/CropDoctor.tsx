
import React, { useState, useCallback } from 'react';
import { diagnoseCrop } from '../services/geminiService';
import type { DiagnosisResult } from '../types';
import Spinner from './Spinner';
import { UploadIcon } from './icons/Icons';

const CropDoctor: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{b64: string, mimeType: string} | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = (reader.result as string).split(',')[1];
        setImageData({ b64, mimeType: file.type });
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = useCallback(async () => {
    if (!imageData) {
      setError("Please select an image first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const diagnosis = await diagnoseCrop(imageData.b64, imageData.mimeType);
      setResult(diagnosis);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, [imageData]);
  
  const ResultCard: React.FC<{title: string; children: React.ReactNode; color: string}> = ({ title, children, color }) => (
      <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${color}`}>
          <h3 className="text-lg font-bold text-brand-green mb-2">{title}</h3>
          {children}
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-brand-green">Crop Doctor</h2>
        <p className="text-gray-600 mt-2">Upload a photo of a plant leaf to get an AI diagnosis for diseases and pests.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
                 <label htmlFor="file-upload" className="cursor-pointer group block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-light-green transition-colors">
                    <div className="flex flex-col items-center">
                        <UploadIcon className="h-12 w-12 text-gray-400 group-hover:text-brand-light-green"/>
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-semibold text-brand-light-green">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                </label>
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="flex justify-center items-center h-48 bg-gray-100 rounded-lg overflow-hidden">
                {imagePreview ? (
                <img src={imagePreview} alt="Crop preview" className="h-full w-full object-cover" />
                ) : (
                <p className="text-gray-500">Image preview</p>
                )}
            </div>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={handleDiagnose}
            disabled={!imageData || loading}
            className="w-full sm:w-auto bg-brand-light-green text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-brand-green transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
          >
            {loading ? <><Spinner/> <span className="ml-2">Analyzing...</span></> : 'Diagnose Plant'}
          </button>
        </div>
      </div>

      {error && <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert"><p>{error}</p></div>}
      
      {result && (
        <div className="mt-8 space-y-6 animate-fade-in">
            <ResultCard title="Diagnosis Report" color={result.is_healthy ? "border-green-500" : "border-red-500"}>
                <h4 className={`text-2xl font-bold ${result.is_healthy ? 'text-green-600' : 'text-red-600'}`}>{result.is_healthy ? "Healthy Plant" : result.disease}</h4>
                <p className="text-gray-700 mt-2">{result.description}</p>
            </ResultCard>

            {!result.is_healthy && (
              <>
                <ResultCard title="Common Causes" color="border-yellow-500">
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {result.causes.map((cause, i) => <li key={i}>{cause}</li>)}
                    </ul>
                </ResultCard>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ResultCard title="Organic Treatments" color="border-brand-light-green">
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {result.organic_treatments.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </ResultCard>
                    <ResultCard title="Chemical Treatments" color="border-brand-brown">
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {result.chemical_treatments.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </ResultCard>
                </div>
              </>
            )}
        </div>
      )}
    </div>
  );
};

export default CropDoctor;

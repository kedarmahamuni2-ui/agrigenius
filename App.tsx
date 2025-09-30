
import React, { useState, lazy, Suspense } from 'react';
import { Tab } from './types';
import Header from './components/Header';
import Spinner from './components/Spinner';

const CropDoctor = lazy(() => import('./components/CropDoctor'));
const FarmingAssistant = lazy(() => import('./components/FarmingAssistant'));
const MarketWatch = lazy(() => import('./components/MarketWatch'));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CropDoctor);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CropDoctor:
        return <CropDoctor />;
      case Tab.FarmingAssistant:
        return <FarmingAssistant />;
      case Tab.MarketWatch:
        return <MarketWatch />;
      default:
        return <CropDoctor />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige text-brand-brown">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-4 sm:p-6 md:p-8">
        <Suspense fallback={
          <div className="flex justify-center items-center h-96">
            <Spinner />
          </div>
        }>
          {renderContent()}
        </Suspense>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AgriGenius. Empowering farmers with AI.</p>
      </footer>
    </div>
  );
};

export default App;


import React from 'react';
import { Tab } from '../types';
import { LeafIcon, ChatBubbleIcon, TrendingUpIcon, LogoIcon } from './icons/Icons';
import TabButton from './TabButton';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-brand-green shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-10 w-10 text-white" />
            <h1 className="text-2xl font-bold text-white tracking-wide">AgriGenius</h1>
          </div>
          <nav className="hidden md:flex space-x-2 bg-gray-800/20 p-1 rounded-lg">
            <TabButton 
              label="Crop Doctor" 
              icon={<LeafIcon className="h-5 w-5 mr-2" />} 
              isActive={activeTab === Tab.CropDoctor} 
              onClick={() => setActiveTab(Tab.CropDoctor)} 
            />
            <TabButton 
              label="Farming Assistant" 
              icon={<ChatBubbleIcon className="h-5 w-5 mr-2" />} 
              isActive={activeTab === Tab.FarmingAssistant} 
              onClick={() => setActiveTab(Tab.FarmingAssistant)} 
            />
            <TabButton 
              label="Market Watch" 
              icon={<TrendingUpIcon className="h-5 w-5 mr-2" />} 
              isActive={activeTab === Tab.MarketWatch} 
              onClick={() => setActiveTab(Tab.MarketWatch)} 
            />
          </nav>
        </div>
        {/* Mobile Navigation */}
        <nav className="md:hidden flex justify-around p-2 bg-brand-green/80 rounded-b-lg">
           <TabButton 
              label="Doctor" 
              icon={<LeafIcon className="h-5 w-5 sm:mr-2" />} 
              isActive={activeTab === Tab.CropDoctor} 
              onClick={() => setActiveTab(Tab.CropDoctor)} 
            />
            <TabButton 
              label="Assistant" 
              icon={<ChatBubbleIcon className="h-5 w-5 sm:mr-2" />} 
              isActive={activeTab === Tab.FarmingAssistant} 
              onClick={() => setActiveTab(Tab.FarmingAssistant)} 
            />
            <TabButton 
              label="Market" 
              icon={<TrendingUpIcon className="h-5 w-5 sm:mr-2" />} 
              isActive={activeTab === Tab.MarketWatch} 
              onClick={() => setActiveTab(Tab.MarketWatch)} 
            />
        </nav>
      </div>
    </header>
  );
};

export default Header;

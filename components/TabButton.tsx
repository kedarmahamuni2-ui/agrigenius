
import React from 'react';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-green focus:ring-white";
  const activeClasses = "bg-white text-brand-green shadow";
  const inactiveClasses = "text-gray-200 hover:bg-white/20 hover:text-white";
  const mobileLabelClasses = "hidden sm:inline";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span className={`md:inline ${mobileLabelClasses}`}>{label}</span>
    </button>
  );
};

export default TabButton;

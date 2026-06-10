import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Atoms/Icon";

interface MobileHeaderProps {
  onBackClick?: () => void;
  streakText?: string;
  userInitials?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onBackClick,
  streakText = "🔥 12 Days",
  userInitials = "JD",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="md:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-surface-container-lowest border-b border-outline-variant select-none">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="text-on-surface-variant cursor-pointer p-1 rounded-full hover:bg-surface-container-low transition-all border-none bg-transparent flex items-center justify-center focus:outline-none"
          aria-label="Kembali"
        >
          <Icon name="arrow_back" className="block text-2xl" />
        </button>
        <h1 className="font-bold text-primary text-on-surface">NihongoZen</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-primary text-on-surface">
          {streakText}
        </span>
        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-[10px] text-white font-bold">
          {userInitials}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;

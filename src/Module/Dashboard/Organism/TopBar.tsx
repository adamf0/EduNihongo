import React from "react";
import Icon from "../Atoms/Icon";
import UserProfile from "../Molecules/UserProfile";

interface TopBarProps {
  onMenuClick: () => void;
  // streakDays: number;
  userName: string;
  userLevel: number;
  userAvatarUrl: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  // streakDays,
  userName,
  userLevel,
  userAvatarUrl,
}) => {
  return (
    <header className="sticky top-0 w-full z-40 flex justify-between items-center px-6 lg:px-10 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant">
      {/* Mobile brand and menu trigger */}
      <div className="flex items-center gap-4 lg:hidden">
        <button
          onClick={onMenuClick}
          className="text-primary cursor-pointer p-1 rounded-md hover:bg-surface-container-low transition-colors focus:outline-none border-none bg-transparent flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <Icon name="menu" className="block text-2xl" />
        </button>
        <span className="text-xl font-bold text-primary">NihongoZen</span>
      </div>

      {/* Desktop header label */}
      <div className="hidden lg:flex flex-col">
        <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
          Dashboard
        </h2>
      </div>

      {/* Status section */}
      <div className="flex items-center gap-4">
        {/* Streak Badge */}
        {/* <div className="flex items-center bg-secondary-fixed text-on-secondary-fixed px-3 py-1.5 rounded-full text-label-sm font-bold shadow-sm select-none">
          <Icon
            name="local_fire_department"
            className="text-[18px] mr-1 block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
          {streakDays} Days
        </div> */}

        {/* User Profile */}
        <UserProfile
          name={userName}
          level={userLevel}
          avatarUrl={userAvatarUrl}
        />
      </div>
    </header>
  );
};

export default TopBar;

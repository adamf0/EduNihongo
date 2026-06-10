import React from "react";

interface UserProfileProps {
  name: string;
  level: number;
  avatarUrl: string;
  className?: string;
  onClick?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  level,
  avatarUrl,
  className = "",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 pl-4 cursor-pointer group select-none ${className}`} //border-l border-outline-variant 
    >
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold leading-none text-on-surface">{name}</p>
        <p className="text-xs text-on-surface-variant mt-1">Level {level}</p>
      </div>
      <div className="w-10 h-10 rounded-full border-2 border-outline-variant overflow-hidden group-hover:border-primary transition-colors flex-shrink-0">
        <img
          alt="User Profile"
          className="w-full h-full object-cover"
          src={avatarUrl}
        />
      </div>
    </div>
  );
};

export default UserProfile;

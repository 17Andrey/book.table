import { useState } from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import { Avatar } from '@radix-ui/themes';
import UserPopup from './UserPopup';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header = ({ onLogoClick }: HeaderProps) => {
  const [showUserPopup, setShowUserPopup] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur border-b border-blue-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
          <button
            className="text-xl font-bold tracking-wide text-black hover:text-black/80 transition-colors font-sans"
            onClick={onLogoClick}
          >
            Book.me
          </button>
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-medium select-none cursor-pointer group flex flex-col items-center active:scale-95 transition-all duration-200 ease-in-out"
              onClick={() => setShowUserPopup(true)}
            >
              User Name 
              <div className="h-[2px] bg-black w-0 group-hover:w-full transition-width duration-200 ease-in-out"/>
            </span> 
            <Avatar 
              size="4" 
              fallback={<PersonIcon width={24} height={24} />} 
              radius="full" 
              color="gray" 
              highContrast
            />
          </div>
        </div>
      </header>

      <UserPopup 
        open={showUserPopup} 
        onClose={() => setShowUserPopup(false)} 
      />
    </>
  );
};

export default Header; 
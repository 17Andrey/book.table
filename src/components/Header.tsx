import { useState } from 'react';
import { PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onLogoClick: () => void;
  onProfileClick: () => void;
}

const Header = ({ onLogoClick, onProfileClick }: HeaderProps) => {
  const [showUserPopup, setShowUserPopup] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      setShowUserPopup(!showUserPopup);
    } else {
      onProfileClick();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <button onClick={onLogoClick} className="text-xl font-bold">
            BookTable
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-full"
          >
            <PersonIcon className="w-5 h-5" />
            <span>{isAuthenticated ? user?.name : 'Войти'}</span>
          </button>
        </div>
      </div>
      {showUserPopup && (
        <div className="absolute right-4 top-16 bg-white border rounded-lg shadow-lg p-2">
          <button
            onClick={() => {
              logout();
              setShowUserPopup(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
          >
            Выйти
          </button>
        </div>
      )}
    </header>
  );
};

export default Header; 
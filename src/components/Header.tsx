import { AvatarIcon, PersonIcon } from '@radix-ui/react-icons';
import { Avatar } from '@radix-ui/themes';

interface HeaderProps {
  onLogoClick: () => void;
  onProfileClick: () => void;
}

const Header = ({ onLogoClick, onProfileClick }: HeaderProps) => (
  <header className="fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur border-b border-blue-200 shadow-sm transition-all">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
      <button
        className="text-xl font-bold tracking-wide text-black hover:text-black/80 transition-colors font-sans"
        onClick={onLogoClick}
      >
        Book.me
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium select-none cursor-pointer group flex flex-col items-center active:scale-95 transition-all duration-200 ease-in-out">User Name <div className="h-[2px] bg-black w-0 group-hover:w-full transition-width duration-200 ease-in-out"/></span> 
        <Avatar size="4" fallback= {<PersonIcon width={24} height={24} />} radius = "full" color = "gray" highContrast/>
      </div>
      {/* <button
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100 transition"
        onClick={onProfileClick}
        aria-label="Профиль"
      >
        <PersonIcon width={24} height={24} />
      </button> */}
    </div>
  </header>
);

export default Header; 
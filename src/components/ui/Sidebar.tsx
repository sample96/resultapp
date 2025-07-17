import React from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, children }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div>
      {/* Sidebar Fullscreen Drawer */}
      {open && (
        <aside
          className="fixed inset-0 z-[10000] h-full w-full max-w-full bg-white shadow-2xl transition-transform duration-300 ease-in-out"
          aria-hidden={!open}
        >
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            &times;
          </button>
          <nav className="flex flex-col gap-4 p-6 mt-10 animate-fade-in">
            {children}
          </nav>
        </aside>
      )}
    </div>
  );
};

export default Sidebar; 
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

  // Close sidebar when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar Fullscreen Drawer */}
      <aside
        className={`fixed inset-y-0 right-0 z-[10000] w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              className="text-gray-400 hover:text-gray-700 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {children}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 
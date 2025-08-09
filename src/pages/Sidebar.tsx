import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 📱 Mobile Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 md:hidden bg-blue-500 text-white px-2 sm:px-4 py-2 flex justify-between items-center shadow-md">
        <button
          className="text-base sm:text-xl font-bold truncate"
          onClick={() => navigate('/')}
        >
          StrapPay
        </button>
        <button
          className="text-white focus:outline-none text-xl sm:text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div><br/><br/>

      {/* 📱 Mobile Sidebar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-10 sm:top-14 left-0 w-full bg-white shadow-md z-40 md:hidden"
          >
            <div className="p-3 sm:p-4">
              <nav className="space-y-2 sm:space-y-4">
                {[
                  { label: 'Dashboard', path: '/dashboards' },
                  { label: 'Reminders', path: '/reminders' },
                  { label: 'Settings', path: '/settings' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    className="block w-full text-left px-2 sm:px-3 py-2 rounded hover:bg-blue-100 text-sm sm:text-base"
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🖥 Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r shadow-md p-3 sm:p-6">
        <nav className="space-y-3 sm:space-y-4">
          <button
            className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
            onClick={() => navigate('/')}
          >
            StrapPay
          </button>
          {[
            { label: 'Dashboard', path: '/dashboards' },
            { label: 'Reminders', path: '/reminders' },
            { label: 'Settings', path: '/settings' },
          ].map((item, idx) => (
            <button
              key={idx}
              className="block w-full text-left px-3 py-2 rounded hover:bg-blue-100"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 📱 Spacer for mobile so content isn't hidden under top bar */}
      <div className="h-10 sm:h-16 md:hidden" />
    </div>
  );
};

export default Sidebar;



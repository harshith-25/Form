import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
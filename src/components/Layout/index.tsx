import React from 'react';
import Header from '../Header';
import Footer from '../Footer';


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    /* flex-col + min-h-screen prevents the footer from jumping up on short pages */
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      {/* Main is the scrolling area. 
          The 'flex-1' ensures it takes up all space between header and footer.
      */}
      <main className="flex-1 flex flex-col items-center w-full overflow-x-hidden">
        {/* This is the restricted content width. 
            'px-4' acts as a safety gutter for mobile screens.
        */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
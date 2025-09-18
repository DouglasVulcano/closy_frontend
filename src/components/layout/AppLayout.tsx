import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8 pb-24 md:pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
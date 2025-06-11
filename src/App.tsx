// import { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from '@/components/ui/toaster';

// // Pages
// import HomePage from '@/pages/Home';
// import RegisterPage from '@/pages/Register';
// import SubscribePage from '@/pages/Subscribe';
// import NewListingPage from '@/pages/NewListing';
// import AdminPage from '@/pages/Admin';
// import SellerProfilePage from '@/pages/SellerProfile';
// import NotFoundPage from '@/pages/NotFound';

// // Layout
// import MainLayout from '@/components/layout/MainLayout';

// // Context Providers
// import { ListingProvider } from '@/context/ListingContext';
// import { AuthProvider } from '@/context/AuthContext';

// function App() {
//   useEffect(() => {
//     // Simulate Telegram WebApp initialization
//     document.title = 'Farmers Market';
    
//     // Try to mock the Telegram WebApp bridge
//     if (!window.Telegram) {
//       window.Telegram = {
//         WebApp: {
//           ready: () => console.log('WebApp ready'),
//           expand: () => console.log('WebApp expanded'),
//           close: () => console.log('WebApp closed'),
//           MainButton: {
//             text: 'CONTINUE',
//             show: () => console.log('Main button shown'),
//             hide: () => console.log('Main button hidden'),
//             onClick: (callback: () => void) => {
//               console.log('Main button clicked');
//               callback();
//             },
//           },
//         },
//       };
//     }
    
//     // Call ready method to notify Telegram WebApp that we are ready
//     window.Telegram?.WebApp?.ready();
    
//     // Expand the WebApp to take full height
//     window.Telegram?.WebApp?.expand();
//   }, []);

//   return (
//     <Router>
//       <AuthProvider>
//         <ListingProvider>
//           <MainLayout>
//             <Routes>
//               <Route path="/" element={<HomePage />} />
//               <Route path="/register" element={<RegisterPage />} />
//               <Route path="/subscribe" element={<SubscribePage />} />
//               <Route path="/new-listing" element={<NewListingPage />} />
//               <Route path="/admin" element={<AdminPage />} />
//               <Route path="/seller/:id" element={<SellerProfilePage />} />
//               <Route path="*" element={<NotFoundPage />} />
//             </Routes>
//           </MainLayout>
//           <Toaster />
//         </ListingProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;

import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { init } from '@telegram-apps/sdk';

// Layout (не леним, так как используется сразу)
import MainLayout from '@/components/layout/MainLayout';

// Context Providers
import { ListingProvider } from '@/context/ListingContext';
import { AuthProvider } from '@/context/AuthContext';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/Home'));
const RegisterPage = lazy(() => import('@/pages/Register'));
const SubscribePage = lazy(() => import('@/pages/Subscribe'));
const NewListingPage = lazy(() => import('@/pages/NewListing'));
const AdminPage = lazy(() => import('@/pages/Admin'));
const SellerProfilePage = lazy(() => import('@/pages/SellerProfile'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize app
    document.title = 'Farmers Market';
    initTelegramWebApp();
  }, []);

  const initTelegramWebApp = () => {
    // Mock for development
    if (!window.Telegram) {
      window.Telegram = {
        WebApp: {
          ready: () => console.log('WebApp ready'),
          expand: () => console.log('WebApp expanded'),
          close: () => console.log('WebApp closed'),
          MainButton: {
            text: 'CONTINUE',
            show: () => console.log('Main button shown'),
            hide: () => console.log('Main button hidden'),
            onClick: (callback: () => void) => {
              console.log('Main button clicked');
              callback();
            },
          },
        },
      };
    }

    // Initialize Telegram WebApp SDK
    try {
      const { requestFullscreen, ready, expand } = init();
      window.Telegram?.WebApp?.ready();
      ready();
      window.Telegram?.WebApp?.expand();
      expand();
      
      if (requestFullscreen.isAvailable()) {
        requestFullscreen().catch(console.error);
      }
    } catch (err) {
      console.error('Telegram WebApp init error:', err);
    }
  };

  return (
    <Router>
      <AuthProvider>
        <ListingProvider>
          <MainLayout>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/subscribe" element={<SubscribePage />} />
                <Route path="/new-listing" element={<NewListingPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/seller/:id" element={<SellerProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </MainLayout>
          <Toaster />
        </ListingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
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

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { init } from '@telegram-apps/sdk';

// Pages
import HomePage from '@/pages/Home';
import RegisterPage from '@/pages/Register';
import SubscribePage from '@/pages/Subscribe';
import NewListingPage from '@/pages/NewListing';
import AdminPage from '@/pages/Admin';
import SellerProfilePage from '@/pages/SellerProfile';
import NotFoundPage from '@/pages/NotFound';

// Layout
import MainLayout from '@/components/layout/MainLayout';

// Context Providers
import { ListingProvider } from '@/context/ListingContext';
import { AuthProvider } from '@/context/AuthContext';

function App() {
  useEffect(() => {
    // Simulate Telegram WebApp initialization
    document.title = 'Farmers Market';

    // Try to mock the Telegram WebApp bridge for testing
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

      // Call ready method to notify Telegram WebApp that we are ready
      window.Telegram?.WebApp?.ready();
      ready();

      // Expand the WebApp to take full height
      window.Telegram?.WebApp?.expand();
      expand();

      // Enable fullscreen mode by default
      if (requestFullscreen.isAvailable()) {
        requestFullscreen().catch((err) => {
          console.error('Failed to enable fullscreen mode:', err);
        });
      }
    } catch (err) {
      console.error('Failed to initialize Telegram WebApp SDK:', err);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ListingProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/new-listing" element={<NewListingPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/seller/:id" element={<SellerProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainLayout>
          <Toaster />
        </ListingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
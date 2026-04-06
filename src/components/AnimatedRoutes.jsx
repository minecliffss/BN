import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import App from './App.jsx'
import LoginPage from './dashboard/LoginPage.jsx'
import DashboardLayout from './dashboard/DashboardLayout.jsx'
import DashboardHome from './dashboard/DashboardHome.jsx'
import HeroPage from './dashboard/HeroPage.jsx'
import PortfolioPage from './dashboard/PortfolioPage.jsx'
import PhotosPage from './dashboard/PhotosPage.jsx'
import ReviewsPage from './dashboard/ReviewsPage.jsx'
import NotFound from './pages/NotFound.jsx'
import SEOPage from './pages/SEOPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'

export default function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<App />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="hero" element={<HeroPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
        <Route path="/locations/:locationId/:serviceId" element={<SEOPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

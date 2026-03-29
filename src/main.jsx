import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import LoginPage from './dashboard/LoginPage.jsx'
import DashboardLayout from './dashboard/DashboardLayout.jsx'
import DashboardHome from './dashboard/DashboardHome.jsx'
import HeroPage from './dashboard/HeroPage.jsx'
import PortfolioPage from './dashboard/PortfolioPage.jsx'
import PhotosPage from './dashboard/PhotosPage.jsx'
import ReviewsPage from './dashboard/ReviewsPage.jsx'
import NotFound from './pages/NotFound.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="hero" element={<HeroPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="photos" element={<PhotosPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)


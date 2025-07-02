import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Market from './pages/Market';
import CoinDetail from './pages/CoinDetail';
import Portfolio from './pages/Portfolio';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="market" element={<Market />} />
              <Route path="coin/:id" element={<CoinDetail />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;
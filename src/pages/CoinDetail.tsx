import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Star, Plus, ExternalLink, Calendar } from 'lucide-react';
import { CoinDetail as CoinDetailType, PriceData } from '../types';
import { fetchCoinDetail, fetchCoinHistory } from '../utils/api';
import { formatCurrency, formatPercentage, getChangeColor, formatDate } from '../utils/formatters';
import { usePortfolio } from '../context/PortfolioContext';
import Chart from '../components/UI/Chart';
import { PageLoader } from '../components/UI/Loader';

const CoinDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartDays, setChartDays] = useState(7);
  const { isInPortfolio, addToPortfolio, removeFromPortfolio } = usePortfolio();

  useEffect(() => {
    const loadCoinData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [coinData, historyData] = await Promise.all([
          fetchCoinDetail(id),
          fetchCoinHistory(id, chartDays),
        ]);
        setCoin(coinData);
        setPriceData(historyData);
      } catch (error) {
        console.error('Error loading coin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoinData();
  }, [id, chartDays]);

  const handlePortfolioToggle = () => {
    if (!coin) return;
    
    if (isInPortfolio(coin.id)) {
      removeFromPortfolio(coin.id);
    } else {
      addToPortfolio({
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        amount: 0,
        purchasePrice: coin.current_price,
      });
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!coin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Coin not found
          </h2>
          <Link
            to="/market"
            className="text-purple-500 hover:text-purple-600 transition-colors"
          >
            Return to Market
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = coin.price_change_percentage_24h >= 0;
  const inPortfolio = isInPortfolio(coin.id);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/market"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Market</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20"
        >
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {coin.name}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 uppercase">
                {coin.symbol}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rank #{coin.market_cap_rank}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(coin.current_price)}
              </p>
              <div className={`flex items-center justify-end space-x-1 ${getChangeColor(coin.price_change_percentage_24h)}`}>
                {isPositive ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                <span className="text-lg font-medium">
                  {formatPercentage(coin.price_change_percentage_24h)}
                </span>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePortfolioToggle}
              className={`p-3 rounded-xl transition-all duration-200 ${
                inPortfolio
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:text-purple-500'
              }`}
            >
              {inPortfolio ? (
                <Star className="w-6 h-6 fill-current" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Price Chart
                </h2>
                <div className="flex space-x-2">
                  {[
                    { days: 1, label: '1D' },
                    { days: 7, label: '7D' },
                    { days: 30, label: '30D' },
                    { days: 90, label: '90D' },
                    { days: 365, label: '1Y' },
                  ].map((period) => (
                    <button
                      key={period.days}
                      onClick={() => setChartDays(period.days)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        chartDays === period.days
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/10 dark:bg-gray-800/10 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
              {priceData && (
                <Chart
                  data={priceData}
                  days={chartDays}
                  isPositive={isPositive}
                />
              )}
            </motion.div>

            {/* Description */}
            {coin.description?.en && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  About {coin.name}
                </h3>
                <div
                  className="text-gray-600 dark:text-gray-300 prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: coin.description.en.split('. ')[0] + '.',
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            {/* Market Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Market Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Market Cap</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(coin.market_cap)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Volume 24h</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(coin.total_volume)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">24h High</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(coin.high_24h)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">24h Low</span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {formatCurrency(coin.low_24h)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">All Time High</span>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-white font-semibold">
                      {formatCurrency(coin.ath)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(coin.ath_date)}
                    </div>
                  </div>
                </div>
                {coin.circulating_supply && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Circulating Supply</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                )}
                {coin.max_supply && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Max Supply</span>
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {coin.max_supply.toLocaleString()} {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Links */}
            {coin.links && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Links
                </h3>
                <div className="space-y-3">
                  {coin.links.homepage[0] && (
                    <a
                      href={coin.links.homepage[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors"
                    >
                      <span className="text-gray-700 dark:text-gray-300">Website</span>
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </a>
                  )}
                  {coin.links.twitter_screen_name && (
                    <a
                      href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors"
                    >
                      <span className="text-gray-700 dark:text-gray-300">Twitter</span>
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </a>
                  )}
                  {coin.links.subreddit_url && (
                    <a
                      href={coin.links.subreddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700/10 transition-colors"
                    >
                      <span className="text-gray-700 dark:text-gray-300">Reddit</span>
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
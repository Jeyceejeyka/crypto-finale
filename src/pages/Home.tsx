import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Star, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Coin } from '../types';
import { fetchCoins } from '../utils/api';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';
import { PageLoader } from '../components/UI/Loader';

const Home: React.FC = () => {
  const [topCoins, setTopCoins] = useState<Coin[]>([]);
  const [gainers, setGainers] = useState<Coin[]>([]);
  const [losers, setLosers] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const coins = await fetchCoins(1, 50);
        setTopCoins(coins.slice(0, 4));
        setGainers(coins.filter(coin => coin.price_change_percentage_24h > 0).slice(0, 3));
        setLosers(coins.filter(coin => coin.price_change_percentage_24h < 0).slice(0, 3));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6"
            >
              JeyCryptoz
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Your ultimate cryptocurrency dashboard. Track, analyze, and manage your digital assets with real-time data and powerful insights.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/market"
                className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span className="text-lg font-semibold">Explore Market</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/portfolio"
                className="px-8 py-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg border border-white/20 dark:border-gray-700/20 text-gray-900 dark:text-white rounded-xl hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300 flex items-center space-x-2"
              >
                <Star className="w-5 h-5" />
                <span className="text-lg font-semibold">My Portfolio</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose JeyCryptoz?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced features designed for both beginners and professional traders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Real-time Data',
                description: 'Get live cryptocurrency prices and market data updated every second',
                color: 'from-yellow-400 to-orange-500',
              },
              {
                icon: Shield,
                title: 'Secure Portfolio',
                description: 'Track your investments securely with encrypted local storage',
                color: 'from-green-400 to-emerald-500',
              },
              {
                icon: Globe,
                title: 'Global Markets',
                description: 'Access data from all major cryptocurrency exchanges worldwide',
                color: 'from-blue-400 to-indigo-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="p-8 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cryptocurrencies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Top Cryptocurrencies
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Market leaders by market capitalization
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCoins.map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link
                  to={`/coin/${coin.id}`}
                  className="block p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{coin.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(coin.current_price)}
                    </p>
                    <div className={`flex items-center space-x-1 ${getChangeColor(coin.price_change_percentage_24h)}`}>
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Movers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Top Gainers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
                Top Gainers (24h)
              </h3>
              <div className="space-y-4">
                {gainers.map((coin) => (
                  <Link
                    key={coin.id}
                    to={`/coin/${coin.id}`}
                    className="flex items-center justify-between p-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20 hover:border-green-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{coin.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(coin.current_price)}
                      </p>
                      <p className="text-sm text-green-500 font-medium">
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Top Losers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <TrendingDown className="w-6 h-6 text-red-500 mr-2" />
                Top Losers (24h)
              </h3>
              <div className="space-y-4">
                {losers.map((coin) => (
                  <Link
                    key={coin.id}
                    to={`/coin/${coin.id}`}
                    className="flex items-center justify-between p-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20 hover:border-red-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{coin.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(coin.current_price)}
                      </p>
                      <p className="text-sm text-red-500 font-medium">
                        {formatPercentage(coin.price_change_percentage_24h)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { Coin, SortOption, SortDirection } from '../types';
import { fetchCoins } from '../utils/api';
import CoinCard from '../components/UI/CoinCard';
import SearchBar from '../components/UI/SearchBar';
import { PageLoader } from '../components/UI/Loader';

const Market: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadCoins = async () => {
      try {
        const data = await fetchCoins(1, 100);
        setCoins(data);
      } catch (error) {
        console.error('Error loading coins:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCoins();
  }, []);

  const filteredAndSortedCoins = useMemo(() => {
    let filtered = coins;

    // Apply search filter
    if (searchQuery) {
      filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (sortBy) {
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'volume':
          aValue = a.total_volume;
          bValue = b.total_volume;
          break;
        case 'change':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        default:
          aValue = a.market_cap;
          bValue = b.market_cap;
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [coins, searchQuery, sortBy, sortDirection]);

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            Cryptocurrency Market
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Explore and analyze the top cryptocurrencies
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search cryptocurrencies..."
          />
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-lg border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAndSortedCoins.length} of {coins.length} cryptocurrencies
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              {[
                { key: 'market_cap', label: 'Market Cap' },
                { key: 'price', label: 'Price' },
                { key: 'volume', label: 'Volume' },
                { key: 'change', label: '24h Change' },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleSort(option.key as SortOption)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === option.key
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 dark:bg-gray-800/10 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20'
                  }`}
                >
                  <span>{option.label}</span>
                  {sortBy === option.key && (
                    sortDirection === 'asc' ? 
                      <SortAsc className="w-3 h-3" /> : 
                      <SortDesc className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coins Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredAndSortedCoins.map((coin, index) => (
            <CoinCard key={coin.id} coin={coin} index={index} />
          ))}
        </motion.div>

        {/* No Results */}
        {filteredAndSortedCoins.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No cryptocurrencies found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Market;
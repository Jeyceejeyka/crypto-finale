import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Coin } from '../types';
import { fetchCoins } from '../utils/api';
import { formatCurrency, formatPercentage, getChangeColor } from '../utils/formatters';

const Portfolio: React.FC = () => {
  const { portfolio, removeFromPortfolio, updatePortfolioItem } = usePortfolio();
  const [currentPrices, setCurrentPrices] = useState<{ [key: string]: Coin }>({});
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentPrices = async () => {
      if (portfolio.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const coins = await fetchCoins(1, 250);
        const pricesMap = coins.reduce((acc, coin) => {
          acc[coin.id] = coin;
          return acc;
        }, {} as { [key: string]: Coin });
        setCurrentPrices(pricesMap);
      } catch (error) {
        console.error('Error loading current prices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentPrices();
  }, [portfolio]);

  const handleEditAmount = (coinId: string, currentAmount: number) => {
    setEditingItem(coinId);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveAmount = (coinId: string) => {
    const amount = parseFloat(editAmount);
    if (amount >= 0) {
      updatePortfolioItem(coinId, { amount });
    }
    setEditingItem(null);
    setEditAmount('');
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      const currentPrice = currentPrices[item.coinId]?.current_price || 0;
      return total + (item.amount * currentPrice);
    }, 0);
  };

  const calculateTotalPnL = () => {
    return portfolio.reduce((total, item) => {
      const currentPrice = currentPrices[item.coinId]?.current_price || 0;
      const purchaseValue = item.amount * item.purchasePrice;
      const currentValue = item.amount * currentPrice;
      return total + (currentValue - purchaseValue);
    }, 0);
  };

  const totalValue = calculatePortfolioValue();
  const totalPnL = calculateTotalPnL();
  const totalPnLPercentage = portfolio.length > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
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
            My Portfolio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Track your cryptocurrency investments
          </p>
        </motion.div>

        {portfolio.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your portfolio is empty
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start building your portfolio by adding cryptocurrencies from the market page.
              </p>
              <motion.a
                href="/market"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Explore Market</span>
              </motion.a>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Portfolio Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6 mb-8"
            >
              <div className="p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Total Value
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              
              <div className="p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Total P&L
                </h3>
                <div className={`text-3xl font-bold ${getChangeColor(totalPnL)}`}>
                  {formatCurrency(totalPnL)}
                </div>
              </div>
              
              <div className="p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Total P&L %
                </h3>
                <div className={`flex items-center space-x-1 text-2xl font-bold ${getChangeColor(totalPnL)}`}>
                  {totalPnL >= 0 ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <TrendingDown className="w-6 h-6" />
                  )}
                  <span>{formatPercentage(totalPnLPercentage)}</span>
                </div>
              </div>
            </motion.div>

            {/* Portfolio Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Holdings
              </h2>
              
              {portfolio.map((item, index) => {
                const currentCoin = currentPrices[item.coinId];
                const currentPrice = currentCoin?.current_price || 0;
                const currentValue = item.amount * currentPrice;
                const purchaseValue = item.amount * item.purchasePrice;
                const pnl = currentValue - purchaseValue;
                const pnlPercentage = purchaseValue > 0 ? (pnl / purchaseValue) * 100 : 0;

                return (
                  <motion.div
                    key={item.coinId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 uppercase">
                            {item.symbol}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {editingItem === item.coinId ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={editAmount}
                                  onChange={(e) => setEditAmount(e.target.value)}
                                  className="w-24 px-2 py-1 bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-600/30 rounded text-gray-900 dark:text-white text-sm"
                                  step="0.00000001"
                                />
                                <button
                                  onClick={() => handleSaveAmount(item.coinId)}
                                  className="text-green-500 hover:text-green-600 transition-colors"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="text-red-500 hover:text-red-600 transition-colors"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {item.amount} {item.symbol.toUpperCase()}
                                </span>
                                <button
                                  onClick={() => handleEditAmount(item.coinId, item.amount)}
                                  className="text-gray-500 hover:text-purple-500 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Avg. {formatCurrency(item.purchasePrice)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(currentValue)}
                          </p>
                          <div className={`text-sm ${getChangeColor(pnl)}`}>
                            {formatCurrency(pnl)} ({formatPercentage(pnlPercentage)})
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(currentPrice)}
                          </p>
                          {currentCoin && (
                            <div className={`text-sm ${getChangeColor(currentCoin.price_change_percentage_24h)}`}>
                              {formatPercentage(currentCoin.price_change_percentage_24h)}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeFromPortfolio(item.coinId)}
                          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
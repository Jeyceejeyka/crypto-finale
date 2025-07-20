import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Star, Plus } from "lucide-react";
import { Coin } from "../../types";
import {
  formatCurrency,
  formatPercentage,
  getChangeColor,
} from "../../utils/formatters";
import { usePortfolio } from "../../context/PortfolioContext";

interface CoinCardProps {
  coin: Coin;
  index: number;
}

const CoinCard: React.FC<CoinCardProps> = ({ coin, index }) => {
  const { isInPortfolio, addToPortfolio, removeFromPortfolio } = usePortfolio();
  const inPortfolio = isInPortfolio(coin.id);

  const handlePortfolioToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inPortfolio) {
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

  const sparklineData = coin.sparkline_in_7d?.price || [];
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
    >
      <Link to={`/coin/${coin.id}`}>
        <div className="relative p-6 bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
          {/* Portfolio Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePortfolioToggle}
            className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
              inPortfolio
                ? "bg-purple-500 text-white"
                : "bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:text-purple-500"
            }`}
          >
            {inPortfolio ? (
              <Star className="w-4 h-4 fill-current" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </motion.button>

          {/* Coin Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-12 h-12 rounded-full"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {coin.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                {coin.symbol}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                #{coin.market_cap_rank}
              </p>
            </div>
          </div>

          {/* Price and Change */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(coin.current_price)}
              </p>
              <div
                className={`flex items-center space-x-1 ${getChangeColor(
                  coin.price_change_percentage_24h
                )}`}
              >
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {formatPercentage(coin.price_change_percentage_24h)}
                </span>
              </div>
            </div>

            {/* Mini Sparkline */}
            {sparklineData.length > 0 && (
              <div className="w-20 h-12">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke={isPositive ? "#10B981" : "#EF4444"}
                    strokeWidth="2"
                    points={sparklineData
                      .map((price, i) => {
                        const x = (i / (sparklineData.length - 1)) * 100;
                        const minPrice = Math.min(...sparklineData);
                        const maxPrice = Math.max(...sparklineData);
                        const y =
                          maxPrice === minPrice
                            ? 25
                            : 50 -
                              ((price - minPrice) / (maxPrice - minPrice)) * 50;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Market Data */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Market Cap
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatCurrency(coin.market_cap)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                Volume 24h
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {formatCurrency(coin.total_volume)}
              </span>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
    </motion.div>
  );
};

export default CoinCard;

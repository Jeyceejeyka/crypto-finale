import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = 'Search cryptocurrencies...', 
  className = '' 
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <div className={`relative flex items-center transition-all duration-200 ${
        isFocused 
          ? 'ring-2 ring-purple-500/50 bg-white/20 dark:bg-gray-800/20' 
          : 'bg-white/10 dark:bg-gray-800/10 hover:bg-white/20 dark:hover:bg-gray-800/20'
      } backdrop-blur-lg rounded-xl border border-white/20 dark:border-gray-700/20`}>
        <Search className="w-5 h-5 text-gray-400 ml-4" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="mr-4 p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchBar;
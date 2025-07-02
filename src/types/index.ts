export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CoinDetail extends Coin {
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  market_data: {
    current_price: { [key: string]: number };
    market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
  };
}

export interface PriceData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface PortfolioItem {
  coinId: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
}

export type ThemeMode = 'light' | 'dark';

export type SortOption = 'market_cap' | 'price' | 'volume' | 'change';
export type SortDirection = 'asc' | 'desc';
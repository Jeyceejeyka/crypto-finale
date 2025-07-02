import axios from 'axios';
import { Coin, CoinDetail, PriceData } from '../types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchCoins = async (page = 1, perPage = 100): Promise<Coin[]> => {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: true,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coins:', error);
    throw error;
  }
};

export const fetchCoinDetail = async (id: string): Promise<CoinDetail> => {
  try {
    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coin detail:', error);
    throw error;
  }
};

export const fetchCoinHistory = async (
  id: string,
  days = 7
): Promise<PriceData> => {
  try {
    const response = await api.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days,
        interval: days <= 1 ? 'hourly' : 'daily',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coin history:', error);
    throw error;
  }
};

export const searchCoins = async (query: string): Promise<any[]> => {
  try {
    const response = await api.get('/search', {
      params: { query },
    });
    return response.data.coins;
  } catch (error) {
    console.error('Error searching coins:', error);
    throw error;
  }
};
import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [usdtAddress, setUsdtAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txSubmitted, setTxSubmitted] = useState(false);

  const product = {
    name: 'Ethiopian Yirgacheffe',
    description: 'Premium Single Origin',
    priceUSD: 24.99,
    priceUSDT: 24.99
  };

  // In production, call Blockonomics /new_address API to generate a fresh address per order.
  // For this tutorial, we use a hardcoded address for simplicity.
  const generateUSDTAddress = useCallback(async () => {
    setLoading(true);
    setError('');
    setUsdtAddress('0x5C0ed91604E92D7f488d62058293ce603BCC68eF');
    setLoading(false);
  }, []);

  const handleBuyClick = useCallback(() => {
    setUsdtAddress('');
    setError('');
    setTxSubmitted(false);
    generateUSDTAddress();
  }, [generateUSDTAddress]);

  const handleNewOrder = useCallback(() => {
    setUsdtAddress('');
    setError('');
    setLoading(false);
    setTxSubmitted(false);
  }, []);

  const submitTransaction = useCallback(async (txhash: string) => {
    try {
      const response = await fetch('http://localhost:3001/monitor_usdt_transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txhash, usdtAddress }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to monitor transaction.');
      }

      console.log(`Transaction ${txhash} submitted for monitoring.`);
      setTxSubmitted(true);
      return { success: true };
    } catch (err: any) {
      console.error(`Error submitting transaction: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, [usdtAddress]);

  const value: AppContextType = {
    usdtAddress,
    loading,
    error,
    txSubmitted,
    product,
    generateUSDTAddress,
    handleBuyClick,
    handleNewOrder,
    submitTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
